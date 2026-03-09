const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  certificateType: { type: String, required: true }, // e.g., "Income", "Caste"
  fullName: { type: String, required: true },
  aadhaarNumber: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Approved, Rejected
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);