const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.GATEWAY_PORT || 3000;

// endereços internos de cada serviço
const TARGETS = {
  '/api/auth':     { url: process.env.AUTH_URL     || 'http://localhost:4001/auth',     name: 'auth' },
  '/api/games':    { url: process.env.CATALOG_URL  || 'http://localhost:4002/games',    name: 'catalog' },
  '/api/checkout': { url: process.env.ORDER_URL    || 'http://localhost:4003/checkout', name: 'order' },
};

const FRONT_DIR = process.env.FRONT_DIR || path.join(__dirname, '../..');

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(FRONT_DIR));

// rota de saúde — útil para checar se todos os serviços subiram
app.get('/api/health', async (req, res) => {
  const status = { gateway: 'ok', services: {} };
  for (const t of Object.values(TARGETS)) {
    const base = t.url.replace(/\/[a-z]+$/, '');
    try {
      const r = await fetch(base + '/health');
      status.services[t.name] = r.ok ? 'ok' : `down (${r.status})`;
    } catch (e) {
      status.services[t.name] = 'unreachable';
    }
  }
  res.json(status);
});

async function forward(req, res, target) {
  const url = target.url + req.url;

  const headers = { ...req.headers };
  delete headers['host'];
  delete headers['content-length'];

  const init = { method: req.method, headers };
  if (!['GET', 'HEAD'].includes(req.method) && req.body && Object.keys(req.body).length) {
    init.body = JSON.stringify(req.body);
    init.headers['content-type'] = 'application/json';
  }

  try {
    const upstream = await fetch(url, init);
    const text = await upstream.text();
    res.status(upstream.status);
    const ct = upstream.headers.get('content-type');
    if (ct) res.setHeader('content-type', ct);
    res.send(text);
  } catch (err) {
    console.error(`[gateway] ${target.name} indisponível:`, err.message);
    res.status(502).json({ error: `${target.name}-service indisponível.` });
  }
}

for (const [prefix, target] of Object.entries(TARGETS)) {
  app.use(prefix, (req, res) => forward(req, res, target));
}

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(FRONT_DIR, 'index.html'));
});

app.use((err, req, res, _next) => {
  console.error('[gateway][ERROR]', err);
  res.status(500).json({ error: 'Erro no gateway.' });
});

app.listen(PORT, () => {
  console.log(`[gateway] rodando em :${PORT}`);
});
