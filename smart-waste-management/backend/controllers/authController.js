const bcrypt = require('bcryptjs'), jwt = require('jsonwebtoken'), User = require('../models/User');
const sign = u => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const pub = u => ({ id: u._id, name: u.name, email: u.email, role: u.role });
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ error: 'Email already registered' });
    const role = email.toLowerCase() === (process.env.ADMIN_EMAIL || '').toLowerCase() ? 'admin' : 'user';
    const u = await User.create({ name, email, password: await bcrypt.hash(password, 10), role });
    res.status(201).json({ token: sign(u), user: pub(u) });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
exports.login = async (req, res) => {
  const u = await User.findOne({ email: (req.body.email || '').toLowerCase() });
  if (!u || !(await bcrypt.compare(req.body.password || '', u.password))) return res.status(401).json({ error: 'Wrong email or password' });
  res.json({ token: sign(u), user: pub(u) });
};
exports.profile = (req, res) => res.json(pub(req.user));
