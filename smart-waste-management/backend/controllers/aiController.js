const { createFromAnalysis } = require('./complaintController');
const analyze = async message => {
  const r = await fetch(process.env.AI_SERVICE_URL + '/analyze', { method: 'POST',
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) });
  if (!r.ok) throw new Error('AI service unavailable');
  return r.json();
};
const wrap = fn => async (req, res) => {
  if (!req.body.message) return res.status(400).json({ error: 'Message is required' });
  try { await fn(req, res); } catch (e) { res.status(502).json({ error: e.message }); }
};
exports.classify = wrap(async (req, res) => res.json(await analyze(req.body.message)));
exports.guidance = wrap(async (req, res) => { const a = await analyze(req.body.message); res.json({ guidance: a.guidance, category: a.category }); });
exports.chat = wrap(async (req, res) => {
  const a = await analyze(req.body.message);
  if (a.intent === 'guidance') return res.json({ reply: a.guidance, analysis: a });
  const c = await createFromAnalysis(req.user._id, req.body.message, a, req.body.location, req.body.photo);
  const photoNote = req.body.photo ? '\n📸 Photo evidence attached & verified for field crews.\n' : '';
  res.json({ analysis: a, complaint: c,
    reply: `Your complaint has been registered.\n\nComplaint ID: ${c.complaintId}\nCategory: ${c.category}\nPriority: ${c.priority}\nStatus: ${c.status}\n\nRouted to: ${c.department}${photoNote}\n\n${a.guidance}` });
});
