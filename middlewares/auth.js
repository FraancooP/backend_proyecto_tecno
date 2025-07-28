// middlewares/auth.js
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  // Obtener token del header Authorization tipo "Bearer token..."
  const authHeader = req.headers['authorization'];
  console.log("AUTH HEADER:", authHeader);
  if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

  // El header suele tener el formato "Bearer <token>"
  const token = authHeader.split(' ')[1];
  console.log("TOKEN EXTRAÍDO:", token);
  if (!token) return res.status(401).json({ error: 'Token mal formado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto'); // usar variable de entorno
    req.usuario = decoded; // guardamos datos del usuario para usar luego
    next(); // continuar con la siguiente función o ruta
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

const soloAdmin = (req, res, next) => {
  if (!req.usuario) return res.status(401).json({ error: 'Usuario no autenticado' });
  if (req.usuario.rol !== 'administrador' && req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso solo para administradores' });
  }
  next();
};

module.exports = { verificarToken, soloAdmin };
