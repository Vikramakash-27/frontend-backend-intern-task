const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // support both 'Authorization: Bearer <token>' and 'x-auth-token'
  const authHeader = req.header('Authorization') || '';
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.header('x-auth-token')) {
    token = req.header('x-auth-token');
  }

  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
};
