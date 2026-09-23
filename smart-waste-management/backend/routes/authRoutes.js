const r = require('express').Router(), c = require('../controllers/authController'), { protect } = require('../middleware/authMiddleware');
r.post('/register', c.register); r.post('/login', c.login); r.get('/profile', protect, c.profile);
module.exports = r;
