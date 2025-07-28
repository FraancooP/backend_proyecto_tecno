const bcrypt = require('bcrypt');
const crypto = require('crypto'); // para generar token random
const Usuario = require('../models/Usuarios');
const { sendVerificationEmail } = require('../utils/mailer');

const register = async (req, res) => {
  const { nombre, apellido, nombre_usuario, contraseña, correo, direccion, telefono } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Generar token único (podés usar crypto)
    const token = crypto.randomBytes(32).toString('hex');
    const token_expiracion = new Date(Date.now() + 24*60*60*1000); // 24 hs después

    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      nombre_usuario,
      contraseña: hashedPassword,
      correo,
      token,
      token_expiracion,
      estado: 'noverificado',
    });
    console.log('Usuario registrado:', nuevoUsuario);
    // Enviar mail de verificación
    await sendVerificationEmail(correo, token);

    res.status(201).json({ mensaje: 'Usuario registrado. Revisa tu email para verificar la cuenta.' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  register,
};
