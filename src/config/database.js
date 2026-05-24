/**
 * Configuração do Sequelize (ORM) sobre SQLite.
 * SQLite foi escolhido por ser relacional, gratuito e zero-config.
 * Para trocar por PostgreSQL/MySQL em produção, basta alterar o dialect.
 */

const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_STORAGE || path.join(__dirname, '../../database.sqlite'),
  logging: false,
});

async function connectDB() {
  await sequelize.authenticate();
  console.log('💾  Sequelize conectado ao SQLite');

  // Carrega models (registra associações) e cria/atualiza tabelas
  require('../models');
  await sequelize.sync();
  console.log('✅  Tabelas sincronizadas: users, games, orders');
}

module.exports = { sequelize, connectDB };
