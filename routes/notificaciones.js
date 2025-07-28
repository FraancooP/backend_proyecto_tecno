const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const Usuario = require('../models/Usuarios');
const Emprendedor = require('../models/Emprendedor');
const Producto = require('../models/Producto');

// Marcar notificación (activar)
router.post('/:emprendedorId', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    const emprendedor = await Emprendedor.findByPk(req.params.emprendedorId);
    if (!emprendedor) return res.status(404).json({ error: 'Emprendedor no encontrado' });
    await usuario.addEmprendedores_notificados(emprendedor);
    res.json({ mensaje: 'Notificación activada para este emprendedor' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Desactivar notificación
router.delete('/:emprendedorId', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    const emprendedor = await Emprendedor.findByPk(req.params.emprendedorId);
    if (!emprendedor) return res.status(404).json({ error: 'Emprendedor no encontrado' });
    await usuario.removeEmprendedores_notificados(emprendedor);
    res.json({ mensaje: 'Notificación desactivada para este emprendedor' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los emprendedores notificados por el usuario
router.get('/', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    const notificados = await usuario.getEmprendedores_notificados();
    res.json(notificados);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Obtener productos nuevos de emprendedores notificados por el usuario
router.get('/nuevos-productos', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    const emprendedores = await usuario.getEmprendedores_notificados();
    const emprendedorIds = emprendedores.map(e => e.id);

    // Busca productos creados en los últimos X minutos (ejemplo: 15 minutos)
    const hace15Min = new Date(Date.now() - 15 * 60 * 1000);
    const productosNuevos = await Producto.findAll({
      where: {
        emprendedorId: emprendedorIds,
        createdAt: { [require('sequelize').Op.gte]: hace15Min }
      }
    });

    res.json(productosNuevos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;