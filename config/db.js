const { Sequelize } = require('sequelize');

// Aquí debes usar el nombre de la base de datos que desees crear o usar
const sequelize = new Sequelize('base_web', 'postgres', 'franco123', {
  host: 'localhost', // Si estás trabajando localmente y el contenedor de Docker está en el mismo equipo
  dialect: 'postgres',
  port: 5433,  // Asegúrate de que el puerto esté configurado correctamente (5433 en este caso por tu docker-compose.yml)
});
module.exports = sequelize;
