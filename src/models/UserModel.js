const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id:           { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name:         { type: DataTypes.STRING,  allowNull: false },
  email:        { type: DataTypes.STRING,  allowNull: false, unique: true, validate: { isEmail: true } },
  passwordHash: { type: DataTypes.STRING,  allowNull: false },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false,
});

const UserModel = {
  raw: User,

  create({ name, email, passwordHash }) {
    return User.create({ name, email, passwordHash });
  },

  findByEmail(email) {
    return User.findOne({ where: { email } });
  },

  findById(id) {
    return User.findByPk(id);
  },
};

module.exports = UserModel;
module.exports.User = User;
