const GameModel = require('../models/GameModel');

const GameController = {
  // GET /api/games
  async list(req, res) {
    const { genre, badge, search } = req.query;
    const games = await GameModel.findAll({ genre, badge, search });
    return res.json(games);
  },

  // GET /api/games/:id
  async detail(req, res) {
    const game = await GameModel.findById(Number(req.params.id));
    if (!game) return res.status(404).json({ error: 'Jogo não encontrado.' });
    return res.json(game);
  },
};

module.exports = GameController;
