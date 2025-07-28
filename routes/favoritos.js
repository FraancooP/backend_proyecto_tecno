const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const Usuario = require('../models/Usuarios');
const Producto = require('../models/Producto');

// ...otros endpoints...

// Agregar producto a favoritos
router.post('/:productoId', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    const producto = await Producto.findByPk(req.params.productoId);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    await usuario.addProductos_favoritos(producto);
    res.json({ mensaje: 'Producto agregado a favoritos' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Quitar producto de favoritos
router.delete('/:productoId', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    const producto = await Producto.findByPk(req.params.productoId);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    await usuario.removeProductos_favoritos(producto);
    res.json({ mensaje: 'Producto eliminado de favoritos' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener favoritos del usuario autenticado
router.get('/', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    const favoritos = await usuario.getProductos_favoritos({
      include: [
        { model: require('../models/Emprendedor') },
        { model: require('../models/Categoria') }
      ]
    });
    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;