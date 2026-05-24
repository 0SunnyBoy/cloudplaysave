const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const JWT_SECRET  = process.env.JWT_SECRET  || 'cpg-secret-2026-troca-em-producao';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';
const SALT_ROUNDS = 10;

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

const AuthController = {
  // POST /api/auth/register
  async register(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });

    if (password.length < 6)
      return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });

    const normalized = email.toLowerCase();
    const exists = await UserModel.findByEmail(normalized);
    if (exists)
      return res.status(409).json({ error: 'E-mail já cadastrado.' });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await UserModel.create({ name, email: normalized, passwordHash });

    const token = signToken(user);
    console.log(`[REGISTER] ${name} <${normalized}>`);
    return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  },

  // POST /api/auth/login
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });

    const user = await UserModel.findByEmail(email.toLowerCase());
    if (!user)
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });

    const token = signToken(user);
    console.log(`[LOGIN] ${user.name} <${user.email}>`);
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  },

  // GET /api/auth/me (protegida)
  me(req, res) {
    return res.json({ user: req.user });
  },
};

module.exports = AuthController;
