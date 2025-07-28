const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Emprendedor = require('./Emprendedor');

const Producto = sequelize.define('Producto', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imagenes: { 
    type: DataTypes.ARRAY(DataTypes.STRING), 
    allowNull: true 
  },
  imagen_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
});

// Relación Producto pertenece a Emprendedor
Producto.belongsTo(Emprendedor, { foreignKey: 'emprendedorId' });

module.exports = Producto;