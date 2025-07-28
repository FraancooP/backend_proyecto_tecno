const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Emprendedor = sequelize.define('Emprendedor', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  img_perfil: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = Emprendedor;