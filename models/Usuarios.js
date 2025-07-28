const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombre_usuario: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
   image_perfil: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'https://res.cloudinary.com/dogj4e9wr/image/upload/v1747948134/pasubircloudi-removebg-preview_ljjnzs.png'
  },
   token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
   token_expiracion: {
    type: DataTypes.DATE,
    allowNull: true,
  },
   estado: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'noverificado',
  }
});

module.exports = Usuario;
