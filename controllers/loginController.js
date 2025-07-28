// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db');
const { Sequelize } = require('sequelize');

exports.login = async (req, res) => {
  const { nombre_usuario, contraseña } = req.body;

  if (!nombre_usuario || !contraseña) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const resultado = await sequelize.query(
      `SELECT * FROM public."Usuarios"
   WHERE nombre_usuario = :nombre_usuario`,
      {
        replacements: { nombre_usuario },
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (resultado.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = resultado[0];
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!contraseñaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    if (usuario.estado !== 'verificado') {  
      return res.status(403).json({ error: 'Cuenta no verificada, revisa tu mail para activarla' });
    }


    const token = jwt.sign(
      {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        rol: usuario.rol
      },
      'secreto',
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      mensaje: 'Login exitoso',
      token
    });

  } catch (error) {
    console.error('Error durante el login:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};
