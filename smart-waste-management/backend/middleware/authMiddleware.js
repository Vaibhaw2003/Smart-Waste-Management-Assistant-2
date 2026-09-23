const jwt = require('jsonwebtoken'), User = require('../models/User');
const auth = async req => {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  if (!t) return null;
  try { return await User.findById(jwt.verify(t, process.env.JWT_SECRET).id).select('-password'); } catch { return null; }
};
exports.protect = async (req, res, next) => {
  req.user = await auth(req);
  req.user ? next() : res.status(401).json({ error: 'Please log in' });
};
exports.adminOnly = (req, res, next) =>
  req.user?.role === 'admin' ? next() : res.status(403).json({ error: 'Admins only' });
// Lets the RPA bot (x-rpa-key header) or an admin update complaints
exports.rpaOrAdmin = async (req, res, next) => {
  if (req.headers['x-rpa-key'] && req.headers['x-rpa-key'] === process.env.RPA_API_KEY) { req.isRpa = true; return next(); }
  req.user = await auth(req);
  req.user?.role === 'admin' ? next() : res.status(403).json({ error: 'Admins or RPA only' });
};
