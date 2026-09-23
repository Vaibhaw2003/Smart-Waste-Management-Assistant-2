const { Schema, model } = require('mongoose');
module.exports = model('Complaint', new Schema({
  complaintId: { type: String, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: String, location: String, photo: String,
  category: String, wasteType: String,
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  department: String, guidance: String,
  status: { type: String, enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'], default: 'Pending' },
  logs: [{ at: { type: Date, default: Date.now }, msg: String }],
}, { timestamps: true }));
