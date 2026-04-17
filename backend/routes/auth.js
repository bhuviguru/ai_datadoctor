const express = require('express');
const router = express.Router();
const { generateToken } = require('../utils/auth');

// Mock User DB
const USERS = [
  { id: 1, username: 'admin', password: 'password123', role: 'Admin' },
  { id: 2, username: 'engineer', password: 'password123', role: 'Data Engineer' },
  { id: 3, username: 'viewer', password: 'password123', role: 'Viewer' }
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  
  if (user) {
    const token = generateToken(user);
    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } else {
    res.status(401).json({ message: 'Invalid surgical credentials.' });
  }
});

module.exports = router;
