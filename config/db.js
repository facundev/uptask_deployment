const { Sequelize } = require('sequelize');
require('dotenv').config({ path: 'variables.env' });

// Option 2: Passing parameters separately (other dialects)
const db = new Sequelize(process.env.BD_NAME, process.env.BD_USER, process.env.BD_PASS, {
  host: process.env.BD_HOST,
  dialect: 'mysql', /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  port: process.env.BD_PORT,

  define: {
      timestamps: false,
  },

  pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
  },
});

module.exports = db;