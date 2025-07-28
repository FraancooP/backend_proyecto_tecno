const express = require('express');
const cors = require('cors');

const registerRoutes = require('./routes/registro');
const loginRoutes = require('./routes/auth');
const usuarioRoutes = require('./routes/usuariosRoutes');
const verificarCuentaRoutes = require('./routes/verificarCuentaRoutes');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/',verificarCuentaRoutes);
app.use('/api/registro', registerRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/usuarios', usuarioRoutes);

app.use('/emprendedores', require('./routes/emprendedor'));
app.use('/productos', require('./routes/producto'));
app.use('/categorias', require('./routes/categorias'));
app.use('/favoritos', require('./routes/favoritos'));
app.use('/notificaciones', require('./routes/notificaciones'));
app.use('/eventos', require('./routes/eventos'));
module.exports = app;
