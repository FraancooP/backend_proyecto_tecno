const Usuario = require('./Usuarios');
const Producto = require('./Producto');
const Emprendedor = require('./Emprendedor');
const Categoria = require('./Categoria');
const Notificacion = require('./Notificacion');
const Evento = require('./Evento');

// Relación Emprendedor tiene muchos Productos
Emprendedor.hasMany(Producto, { foreignKey: 'emprendedorId' });

// Relación Producto pertenece a Emprendedor
Producto.belongsTo(Emprendedor, { foreignKey: 'emprendedorId' });

// Relación Categoria tiene muchos Productos
Categoria.hasMany(Producto, { foreignKey: 'categoriaId' });
Producto.belongsTo(Categoria, { foreignKey: 'categoriaId' });

// Relación Usuario y Producto (favoritos) muchos a muchos
Usuario.belongsToMany(Producto, { through: 'UsuarioFavoritos', as: 'productos_favoritos', allowNull: true });
Producto.belongsToMany(Usuario, { through: 'UsuarioFavoritos', as: 'usuarios_favoritos', allowNull: true });

Usuario.belongsToMany(Emprendedor, { through: Notificacion, as: 'emprendedores_notificados' });
Emprendedor.belongsToMany(Usuario, { through: Notificacion, as: 'usuarios_notificados' });

module.exports = {
  Usuario,
  Producto,
  Emprendedor,
  Categoria,
  Notificacion,
  Evento
};