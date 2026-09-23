const r = require('express').Router(), c = require('../controllers/aiController'), { protect } = require('../middleware/authMiddleware');
r.post('/chat', protect, c.chat); r.post('/classify', protect, c.classify); r.post('/guidance', protect, c.guidance);
module.exports = r;
