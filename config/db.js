const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración para Railway (producción) o local (desarrollo)
const sequelize = new Sequelize(
  process.env.PGDATABASE || 'base_web',
  process.env.PGUSER || 'postgres', 
  process.env.PGPASSWORD || 'franco123',
  {
    host: process.env.PGHOST || 'localhost',
    dialect: 'postgres',
    port: process.env.PGPORT || 5433,
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    logging: process.env.NODE_ENV === 'production' ? false : console.log
  }
);

module.exports = sequelize;
