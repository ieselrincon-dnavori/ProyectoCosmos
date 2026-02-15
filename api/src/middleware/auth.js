const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {

  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({
      error: 'Token requerido'
    });
  }

  const token = header.split(' ')[1];

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET   // 🔥 NUNCA hardcodear
    );

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      error: 'Token inválido'
    });

  }
};
