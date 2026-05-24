const express = require('express');
const cors    = require('cors');
const { connectDB } = require('./src/config/database');
const { runSeed }   = require('./src/config/seed');
const gameRoutes    = require('./src/routes/gameRoutes');

const app  = express();
const PORT = process.env.CATALOG_PORT || 4002;

app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => res.json({ service: 'catalog', status: 'ok' }));
app.use('/games', gameRoutes);

app.use((err, req, res, _next) => {
  console.error('[catalog][ERROR]', err);
  res.status(500).json({ error: 'Erro interno do catalog-service.' });
});

(async () => {
  await connectDB();
  await runSeed();
  app.listen(PORT, () => console.log(`[catalog] rodando em :${PORT}`));
})().catch(err => { console.error(err); process.exit(1); });
