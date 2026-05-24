/**
 * Model: User (Sequelize) — Repository Pattern.
 * Banco isolado deste serviço (auth.sqlite).
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id:           { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name:         { type: DataTypes.STRING,  allowNull: false },
  email:        { type: DataTypes.STRING,  allowNull: false, unique: true, validate: { isEmail: true } },
  passwordHash: { type: DataTypes.STRING,  allowNull: false },
}, { tableName: 'users', timestamps: true, createdAt: 'createdAt', updatedAt: false });

module.exports = {
  raw: User,
  User,
  create: (data) => User.create(data),
  findByEmail: (email) => User.findOne({ where: { email } }),
  findById: (id) => User.findByPk(id),
};
