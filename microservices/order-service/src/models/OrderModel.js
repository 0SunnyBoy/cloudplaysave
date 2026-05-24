/**
 * Model: Order (Sequelize) — Repository Pattern.
 * Em microsserviços não usamos FK física para User (banco isolado);
 * `userId` é referência lógica (preserva consistência via aplicação).
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id:        { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  orderNum:  { type: DataTypes.STRING,  allowNull: false, unique: true },
  userId:    { type: DataTypes.INTEGER, allowNull: false },
  payMethod: { type: DataTypes.STRING,  allowNull: false },
  total:     { type: DataTypes.FLOAT,   allowNull: false },
  items:     {
    type: DataTypes.TEXT, allowNull: false,
    get()    { const r = this.getDataValue('items'); return r ? JSON.parse(r) : []; },
    set(v)   { this.setDataValue('items', JSON.stringify(v)); },
  },
}, { tableName: 'orders', timestamps: true, createdAt: 'createdAt', updatedAt: false });

module.exports = {
  raw: Order,
  Order,
  create: (data) => Order.create(data),
  findByOrderNum: (orderNum) => Order.findOne({ where: { orderNum } }),
  findByUserId: (userId) => Order.findAll({ where: { userId }, order: [['createdAt', 'DESC']] }),
};
