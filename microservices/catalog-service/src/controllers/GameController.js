const GameModel = require('../models/GameModel');

module.exports = {
  async list(req, res) {
    const { genre, badge, search } = req.query;
    return res.json(await GameModel.findAll({ genre, badge, search }));
  },

  async detail(req, res) {
    const game = await GameModel.findById(Number(req.params.id));
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });
    return res.json(game);
  },
};
