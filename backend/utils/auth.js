const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'surgeon-secret-key-2024';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET,
    { expiresIn: '24h' }
  );
};

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ message: 'No credential provided.' });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized session.' });
    }
    req.user = decoded;
    next();
  });
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient privileges for this operation.' });
    }
    next();
  };
};

module.exports = { generateToken, verifyToken, checkRole };
