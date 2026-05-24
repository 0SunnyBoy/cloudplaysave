const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'cpg-secret-2026-troca-em-producao';

module.exports = function authMiddleware(req, res, next) {
  const h = req.headers['authorization'];
  if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ error: 'Token não fornecido.' });
  try {
    req.user = jwt.verify(h.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};
