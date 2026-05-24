const { DataTypes } = require('sequelize');
const { sequelize }  = require('../config/database');
const { User }       = require('./UserModel');

const Order = sequelize.define('Order', {
  id:        { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  orderNum:  { type: DataTypes.STRING,  allowNull: false, unique: true },
  userId:    { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
  payMethod: { type: DataTypes.STRING,  allowNull: false },
  total:     { type: DataTypes.FLOAT,   allowNull: false },
  items:     {
    type: DataTypes.TEXT, allowNull: false,
    get() {
      const raw = this.getDataValue('items');
      return raw ? JSON.parse(raw) : [];
    },
    set(value) {
      this.setDataValue('items', JSON.stringify(value));
    },
  },
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false,
});

// um usuário pode ter vários pedidos
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

const OrderModel = {
  raw: Order,

  create({ orderNum, userId, payMethod, total, items }) {
    return Order.create({ orderNum, userId, payMethod, total, items });
  },

  findByOrderNum(orderNum) {
    return Order.findOne({ where: { orderNum } });
  },

  findByUserId(userId) {
    return Order.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
  },
};

module.exports = OrderModel;
module.exports.Order = Order;
