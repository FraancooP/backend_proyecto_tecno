// controllers/usuarioController.js
const Usuario = require('../models/Usuarios');
const bcrypt = require('bcrypt');
const cloudinary = require('../config/cloudinary');
const fs = require('fs').promises;
const crypto = require('crypto');
const { sendResetPasswordEmail } = require('../utils/mailer');
const { Op } = require('sequelize');

exports.obtenerPerfil = async (req, res) => {
  try {
    // req.usuario viene del token decodificado (middleware verificarToken)
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['contraseña'] } // No devolver contraseña
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.actualizarPerfil = async (req, res) => {
  try {
    const { nombre, apellido, direccion, telefono } = req.body;

    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar campos
    usuario.nombre = nombre || usuario.nombre;
    usuario.apellido = apellido || usuario.apellido;
    usuario.direccion = direccion || usuario.direccion;
    usuario.telefono = telefono || usuario.telefono;

    await usuario.save();

    res.json({ mensaje: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.actualizarImagenPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

     const subirImagenCloudinary = async (file) => {
          if (!file) return null;
          const result = await cloudinary.uploader.upload(file.path, { folder: 'imagenUsuarios' });
          await fs.unlink(file.path); // borrar archivo local luego de subirlo
          return result.secure_url;
        };
        const archivos = req.files;
        const imgPerfil = archivos.find(f => f.fieldname === `imgPerfil`);
        const imgPerfil_Url = await subirImagenCloudinary(imgPerfil);



    // Actualizar campo
    usuario.image_perfil = imgPerfil_Url || usuario.image_perfil;

    await usuario.save();

    res.json({ mensaje: 'Foto actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar foto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.cambiarContraseña = async (req, res) => {
  try {
    const { contraseña_actual, nueva_contraseña } = req.body;

    if (!contraseña_actual || !nueva_contraseña) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const esValida = await bcrypt.compare(contraseña_actual, usuario.contraseña);
    if (!esValida) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    // Hashear y guardar nueva contraseña
    usuario.contraseña = await bcrypt.hash(nueva_contraseña, 10);
    await usuario.save();

    res.json({ mensaje: 'Contraseña cambiada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await usuario.destroy();

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.cambiarNombreUsuario = async (req, res) => {
    const { nuevoUsername } = req.body;
    const id = req.usuario.id;
    const existe = await Usuario.findOne({ where: { nombre_usuario: nuevoUsername } });
    if (existe) return res.status(400).json({ error: 'Nombre de usuario ya en uso' });

    const usuario = await Usuario.findByPk(id);
    usuario.nombre_usuario = nuevoUsername;
    await usuario.save();
    res.json({ mensaje: 'Nombre de usuario actualizado' });
};
exports.solicitarRecuperacion = async (req, res) => {
  try {
    const { correo } = req.body;
    if (!correo) return res.status(400).json({ error: 'Falta el correo.' });

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) return res.status(404).json({ error: 'Correo no registrado.' });

    const token = crypto.randomBytes(32).toString('hex');
    usuario.token = token;
    usuario.token_expiracion = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    await usuario.save();

    await sendResetPasswordEmail(correo, token);

    res.json({ mensaje: 'Revisa tu correo para cambiar la contraseña.' });
  } catch (error) {
    console.error('Error en solicitarRecuperacion:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

// Resetear contraseña con token
exports.resetPasswordWithToken = async (req, res) => {
  try {
    const { token, nueva_contraseña } = req.body;
    if (!token || !nueva_contraseña) {
      return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }

    const usuario = await Usuario.findOne({
      where: {
        token: token,
        token_expiracion: { [Op.gt]: new Date() }
      }
    });

    if (!usuario) {
      return res.status(400).json({ error: 'Token inválido o expirado.' });
    }

    usuario.contraseña = await bcrypt.hash(nueva_contraseña, 10);
    usuario.token = null;
    usuario.token_expiracion = null;
    await usuario.save();

    res.json({ mensaje: 'Contraseña cambiada correctamente.' });
  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};