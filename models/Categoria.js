const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Categoria = sequelize.define('Categoria', {
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

module.exports = Categoria;