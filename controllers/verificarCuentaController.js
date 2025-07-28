// controllers/verificarCuentaController.js
const User = require('../models/Usuarios');

exports.verificarCuenta = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).send('Token de verificación faltante');
  }

  try {
    const user = await User.findOne({ where: { token: token } });

    if (!user) {
      return res.status(400).send('Token inválido o expirado');
    }

    if (user.estado === 'verificado') {
      return res.send('La cuenta ya está verificada.');
    }

    user.estado = 'verificado';
    user.token = null;
    await user.save();

    res.send('Cuenta verificada correctamente. ¡Gracias!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
};
