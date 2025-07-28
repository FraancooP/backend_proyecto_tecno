const express = require('express');
const router = express.Router();
const Evento = require('../models/Evento');


router.get('/ciudades', async (req, res) => {
  try {
    const { fn, col, Op } = require('sequelize');
    const ciudades = await Evento.findAll({
      attributes: [
        [fn('DISTINCT', col('ciudad')), 'ciudad']
      ],
      where: {
        ciudad: { [Op.ne]: null }
      },
      raw: true
    });
    res.json(ciudades.map(e => e.ciudad).filter(Boolean));
  } catch (error) {
    console.error('Error en /eventos/ciudades:', error);
    res.status(500).json({ error: error.message });
  }
});
// Obtener todos los eventos
router.get('/', async (req, res) => {
  console.log('Query params:', req.query);
  const { ciudad } = req.query;
  let where = {};
  if (ciudad) where.ciudad = ciudad;
  try {
    const eventos = await Evento.findAll({ where });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener evento por ID
router.get('/:id', async (req, res) => {
  try {
    const evento = await Evento.findByPk(req.params.id);
    if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear evento (opcional, para admin)
router.post('/', async (req, res) => {
  try {
    const evento = await Evento.create(req.body);
    res.status(201).json(evento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;