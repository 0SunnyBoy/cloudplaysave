/**
 * Barrel de models — importa todos para registrar as associações Sequelize
 * antes do `sequelize.sync()` rodar.
 */

const UserModel  = require('./UserModel');
const GameModel  = require('./GameModel');
const OrderModel = require('./OrderModel');

module.exports = { UserModel, GameModel, OrderModel };
