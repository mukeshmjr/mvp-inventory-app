const jwt = require('jsonwebtoken');

module.exports = (secret) => (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(403);
  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch {
    res.sendStatus(403);
  }
};
