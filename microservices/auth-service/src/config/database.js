const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || path.join(__dirname, '../../auth.sqlite'),
  logging: false,
});

async function connectDB() {
  await sequelize.authenticate();
  require('../models');
  await sequelize.sync();
  console.log('[auth] 💾 Sequelize conectado (auth.sqlite)');
}

module.exports = { sequelize, connectDB };
