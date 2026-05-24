const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const JWT_SECRET  = process.env.JWT_SECRET  || 'cpg-secret-2026-troca-em-producao';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';
const SALT_ROUNDS = 10;

const sign = (u) => jwt.sign({ id: u.id, name: u.name, email: u.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

module.exports = {
  async register(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    if (password.length < 6)          return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });

    const e = email.toLowerCase();
    if (await UserModel.findByEmail(e)) return res.status(409).json({ error: 'E-mail já cadastrado.' });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await UserModel.create({ name, email: e, passwordHash });
    console.log(`[auth] REGISTER ${name} <${e}>`);
    return res.status(201).json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email } });
  },

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });

    const user = await UserModel.findByEmail(email.toLowerCase());
    if (!user) return res.status(401).json({ error: 'E-mail ou senha incorretos.' });

    if (!(await bcrypt.compare(password, user.passwordHash)))
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });

    console.log(`[auth] LOGIN ${user.email}`);
    return res.json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email } });
  },

  me(req, res) {
    return res.json({ user: req.user });
  },
};
