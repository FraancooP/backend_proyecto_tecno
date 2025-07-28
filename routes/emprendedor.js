const express = require('express');
const router = express.Router();
const Emprendedor = require('../models/Emprendedor');
const { Op } = require('sequelize');

router.post('/', async (req, res) => {
  try {
    const emprendedor = await Emprendedor.create(req.body);
    res.status(201).json(emprendedor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  const { direcciones, limit = 6, offset = 0 } = req.query;
  let where = {};
  if (direcciones) {
    where.direccion = { [Op.in]: direcciones.split(',') };
  }
  try {
    const emprendedores = await Emprendedor.findAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    res.json(emprendedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las direcciones únicas de emprendedores
router.get('/direcciones', async (req, res) => {
  try {
    const { Op } = require('sequelize');
    const Emprendedor = require('../models/Emprendedor');
    const direcciones = await Emprendedor.findAll({
      attributes: ['direccion'],
      group: ['direccion']
    });
    res.json(direcciones.map(e => e.direccion));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/buscar', async (req, res) => {
  const { q } = req.query;
  try {
    const { Op } = require('sequelize');
    const emprendedores = await Emprendedor.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.iLike]: `%${q}%` } },
          { apellido: { [Op.iLike]: `%${q}%` } },
          { direccion: { [Op.iLike]: `%${q}%` } }
        ]
      }
    });
    res.json(emprendedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;