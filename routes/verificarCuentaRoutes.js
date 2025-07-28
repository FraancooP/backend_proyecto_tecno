// routes/verificarCuentaRoutes.js
const express = require('express');
const router = express.Router();

const verificarCuentaController = require('../controllers/verificarCuentaController');

router.get('/verify-email', verificarCuentaController.verificarCuenta);

module.exports = router;
