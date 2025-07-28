const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Configuración para Railway usando DATABASE_URL si está disponible
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: process.env.NODE_ENV === 'production' ? false : console.log
  });
} else {
  // Configuración local o usando variables individuales
  sequelize = new Sequelize(
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
}

module.exports = sequelize;
