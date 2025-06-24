require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  }
);

sequelize.authenticate()
  .then(() => console.log('🟢 Banco de dados conectado com sucesso!'))
  .catch(err => console.error('🔴 Erro ao conectar com o banco:', err));

module.exports = sequelize;
