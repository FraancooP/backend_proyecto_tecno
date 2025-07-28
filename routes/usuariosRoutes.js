// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const { verificarToken, soloAdmin } = require('../middlewares/auth');
const usuarioController = require('../controllers/usuariosController');

// Obtener perfil propio (autenticado)
router.get('/perfil', verificarToken, usuarioController.obtenerPerfil);

// Actualizar perfil propio
router.put('/perfil', verificarToken, usuarioController.actualizarPerfil);
router.put('/imagen-perfil',upload.any(), verificarToken, usuarioController.actualizarImagenPerfil);
// Cambiar contraseña
router.put('/cambiar-contrasena', verificarToken, usuarioController.cambiarContraseña);

// Eliminar usuario por ID (solo admin)
router.delete('/:id', verificarToken, soloAdmin, usuarioController.eliminarUsuario);

router.put('/cambiar-username', verificarToken, usuarioController.cambiarNombreUsuario);

// Solicitar recuperación de contraseña
router.post('/solicitar-recuperacion', usuarioController.solicitarRecuperacion);

// Resetear contraseña con token
router.post('/reset-password', usuarioController.resetPasswordWithToken);
// ...existing code...
module.exports = router;
