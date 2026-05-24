const express = require('express');
const cors    = require('cors');
const path    = require('path');

const { connectDB } = require('./src/config/database');
const { runSeed }   = require('./src/config/seed');

const authRoutes  = require('./src/routes/authRoutes');
const gameRoutes  = require('./src/routes/gameRoutes');
const orderRoutes = require('./src/routes/orderRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

app.use('/api/auth',     authRoutes);
app.use('/api/games',    gameRoutes);
app.use('/api/checkout', orderRoutes);

// qualquer rota que não seja /api/* devolve o index.html (SPA)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((err, req, res, _next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

async function start() {
  await connectDB();
  await runSeed();

  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Falha ao iniciar:', err);
  process.exit(1);
});
