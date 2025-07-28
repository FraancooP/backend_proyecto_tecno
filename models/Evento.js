const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Evento = sequelize.define('Evento', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fecha_fin: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  ciudad: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imagenes: {
    type: DataTypes.ARRAY(DataTypes.STRING), // o JSON si usas SQLite
    allowNull: true,
  },
  destacado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
});

module.exports = Evento;