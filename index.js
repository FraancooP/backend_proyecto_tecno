const app = require('./app');
const sequelize = require('./config/db');
require('./models/asociador_Tablas'); // importa todos los modelos y define las asociaciones (esto ya incluye Company, no hace falta requerirlo aparte)

const PORT = process.env.PORT || 3000;

// Manejadores de errores globales
process.on('uncaughtException', (err) => {
  console.error('Error no capturado:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Rechazo no manejado:', reason);
});

console.log('Iniciando sincronización de base de datos...');

sequelize.sync({ alter: true }) // usar { alter: false } en producción
  .then(async () => {
    console.log('Base de datos sincronizada correctamente');
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });
