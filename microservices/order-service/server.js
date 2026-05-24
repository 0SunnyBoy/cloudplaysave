const express = require('express');
const cors    = require('cors');
const { connectDB } = require('./src/config/database');
const orderRoutes   = require('./src/routes/orderRoutes');

const app  = express();
const PORT = process.env.ORDER_PORT || 4003;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.get('/health', (req, res) => res.json({ service: 'order', status: 'ok' }));
app.use('/checkout', orderRoutes);

app.use((err, req, res, _next) => {
  console.error('[order][ERROR]', err);
  res.status(500).json({ error: 'Erro interno do order-service.' });
});

connectDB()
  .then(() => app.listen(PORT, () => console.log(`[order] rodando em :${PORT}`)))
  .catch(err => { console.error(err); process.exit(1); });
