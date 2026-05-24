const express = require('express');
const cors    = require('cors');
const { connectDB } = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');

const app  = express();
const PORT = process.env.AUTH_PORT || 4001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.get('/health', (req, res) => res.json({ service: 'auth', status: 'ok' }));
app.use('/auth', authRoutes);

app.use((err, req, res, _next) => {
  console.error('[auth][ERROR]', err);
  res.status(500).json({ error: 'Erro interno do auth-service.' });
});

connectDB()
  .then(() => app.listen(PORT, () => console.log(`[auth] rodando em :${PORT}`)))
  .catch(err => { console.error(err); process.exit(1); });
