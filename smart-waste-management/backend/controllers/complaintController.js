const Complaint = require('../models/Complaint'), User = require('../models/User');

exports.createFromAnalysis = async (userId, message, a, location, photo) => {
  const n = await Complaint.countDocuments();
  const c = await Complaint.create({
    complaintId: `SWM-${1025 + n}`, userId, message, location, photo,
    category: a.category, wasteType: a.wasteType, priority: a.priority,
    department: a.department, guidance: a.guidance,
    logs: [{ msg: photo ? 'Complaint recorded with photo evidence by AI assistant' : 'Complaint recorded by AI assistant' }],
  });
  if (process.env.RPA_WEBHOOK_URL) { // hand off to UiPath / Power Automate
    fetch(process.env.RPA_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ complaintId: c.complaintId, category: c.category, wasteType: c.wasteType,
        priority: c.priority, location: c.location, department: c.department, userId: String(userId) }) })
      .then(() => Complaint.updateOne({ _id: c._id }, { $push: { logs: { msg: 'RPA workflow triggered' } } }))
      .catch(() => {});
  }
  return c;
};
exports.create = async (req, res) => {
  const { message, category, priority, department, location, photo } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });
  res.status(201).json(await exports.createFromAnalysis(req.user._id, message,
    { category: category || 'Other Waste Management Issues', priority, department: department || 'General Support' }, location, photo));
};
exports.list = async (req, res) =>
  res.json(await Complaint.find(req.user.role === 'admin' ? {} : { userId: req.user._id }).sort('-createdAt'));
exports.get = async (req, res) => {
  const c = await Complaint.findOne({ complaintId: req.params.id });
  if (!c || (req.user.role !== 'admin' && String(c.userId) !== String(req.user._id))) return res.status(404).json({ error: 'Complaint not found' });
  res.json(c);
};
exports.update = async (req, res) => {
  const { status, department } = req.body, set = {}, msg = [];
  if (status) { set.status = status; msg.push(`Status → ${status}`); }
  if (department) { set.department = department; msg.push(`Routed to ${department}`); }
  const c = await Complaint.findOneAndUpdate({ complaintId: req.params.id },
    { $set: set, $push: { logs: { msg: `${req.isRpa ? 'RPA' : 'Admin'}: ${msg.join(', ') || 'updated'}` } } },
    { new: true, runValidators: true });
  c ? res.json(c) : res.status(404).json({ error: 'Complaint not found' });
};
// ---- admin ----
const group = f => Complaint.aggregate([{ $group: { _id: '$' + f, n: { $sum: 1 } } }])
  .then(r => Object.fromEntries(r.map(x => [x._id, x.n])));
exports.adminComplaints = async (_, res) => res.json(await Complaint.find().sort('-createdAt').populate('userId', 'name email'));
exports.adminUsers = async (_, res) => res.json(await User.find().select('-password'));
exports.statistics = async (_, res) => res.json({
  total: await Complaint.countDocuments(), byStatus: await group('status'), byCategory: await group('category'),
  byPriority: await group('priority'), byDepartment: await group('department'),
});
