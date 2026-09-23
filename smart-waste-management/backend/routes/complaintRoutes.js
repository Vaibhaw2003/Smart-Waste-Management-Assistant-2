const r = require('express').Router(), c = require('../controllers/complaintController'), m = require('../middleware/authMiddleware');
r.post('/', m.protect, c.create); r.get('/', m.protect, c.list); r.get('/:id', m.protect, c.get); r.put('/:id', m.rpaOrAdmin, c.update);
module.exports = r;
