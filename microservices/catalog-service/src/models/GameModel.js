/**
 * Model: Game (Sequelize) — Repository Pattern.
 */
const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

const Game = sequelize.define('Game', {
  id:       { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title:    { type: DataTypes.STRING,  allowNull: false },
  genre:    { type: DataTypes.STRING,  allowNull: false },
  price:    { type: DataTypes.FLOAT,   allowNull: false, defaultValue: 0 },
  oldPrice: { type: DataTypes.FLOAT,   allowNull: true },
  rating:   { type: DataTypes.FLOAT,   allowNull: false, defaultValue: 0 },
  image:    { type: DataTypes.TEXT,    allowNull: true },
  badge:    { type: DataTypes.STRING,  allowNull: true },
  desc:     { type: DataTypes.TEXT,    allowNull: true },
}, { tableName: 'games', timestamps: false });

module.exports = {
  raw: Game,
  Game,
  findAll({ genre, badge, search } = {}) {
    const where = {};
    if (genre)  where.genre = { [Op.like]: `%${genre}%` };
    if (badge)  where.badge = badge;
    if (search) where.title = { [Op.like]: `%${search}%` };
    return Game.findAll({ where });
  },
  findById: (id) => Game.findByPk(id),
  count:    () => Game.count(),
  bulkCreate: (rows) => Game.bulkCreate(rows),
};
