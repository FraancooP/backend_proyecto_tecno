const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Emprendedor = require('../models/Emprendedor');
const Categoria = require('../models/Categoria');

router.post('/', async (req, res) => {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const { categorias, limit = 6, offset = 0 } = req.query;
  let where = {};
  if (categorias) {
    // categorias = "1,2,3"
    where.categoriaId = categorias.split(',').map(Number);
  }
  try {
    const productos = await Producto.findAll({
      where,
      include: [
        { model: Emprendedor },
        { model: Categoria }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/por-categoria/:categoriaId', async (req, res) => {
  const { categoriaId } = req.params;
  try {
    const productos = await Producto.findAll({
      where: { categoriaId },
      include: [
        { model: Emprendedor },
        { model: Categoria }
      ]
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/buscar', async (req, res) => {
  const { q } = req.query;
  try {
    const productos = await Producto.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { nombre: { [require('sequelize').Op.iLike]: `%${q}%` } },
          { descripcion: { [require('sequelize').Op.iLike]: `%${q}%` } }
        ]
      },
      include: [
        { model: Emprendedor },
        { model: Categoria }
      ]
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/por-emprendedor/:emprendedorId', async (req, res) => {
  const { emprendedorId } = req.params;
  try {
    const productos = await Producto.findAll({
      where: { emprendedorId },
      include: [
        { model: Emprendedor },
        { model: Categoria }
      ]
    });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;