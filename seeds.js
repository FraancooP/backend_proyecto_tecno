const sequelize = require('./config/db');
const Usuario = require('./models/Usuarios');
const Categoria = require('./models/Categoria');
const Producto = require('./models/Producto');
require('./models/asociador_Tablas');

async function seedDatabase() {
  try {
    // Crear categorías de ejemplo
    const categorias = await Categoria.bulkCreate([
      { nombre: 'Tecnología', descripcion: 'Productos tecnológicos' },
      { nombre: 'Ropa', descripcion: 'Ropa y accesorios' },
      { nombre: 'Hogar', descripcion: 'Productos para el hogar' }
    ]);

    // Crear usuario de ejemplo
    const usuarios = await Usuario.bulkCreate([
      {
        nombre: 'Admin',
        email: 'admin@test.com',
        password: '$2b$10$ejemplo', // Deberías hashear la contraseña
        verificado: true
      }
    ]);

    console.log('Datos de prueba creados exitosamente');
  } catch (error) {
    console.error('Error al crear datos de prueba:', error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();
