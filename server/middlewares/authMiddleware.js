const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, 'tu_secreto'); // Reemplaza 'tu_secreto' con tu clave secreta
    req.studentId = decoded.id; // Asignamos el ID del estudiante al objeto req
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};

module.exports = authMiddleware;
