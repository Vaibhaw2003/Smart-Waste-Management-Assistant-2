const r = require('express').Router(), c = require('../controllers/complaintController'), { protect, adminOnly } = require('../middleware/authMiddleware');
r.use(protect, adminOnly);
r.get('/complaints', c.adminComplaints); r.get('/users', c.adminUsers); r.get('/statistics', c.statistics);
module.exports = r;
