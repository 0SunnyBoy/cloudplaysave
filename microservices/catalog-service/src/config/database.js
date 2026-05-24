const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || path.join(__dirname, '../../catalog.sqlite'),
  logging: false,
});

async function connectDB() {
  await sequelize.authenticate();
  require('../models');
  await sequelize.sync();
  console.log('[catalog] 💾 Sequelize conectado (catalog.sqlite)');
}

module.exports = { sequelize, connectDB };
