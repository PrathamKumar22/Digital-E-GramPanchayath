const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  serviceType: { 
    type: String, 
    required: true 
  }, 
  status: { 
    type: String, 
    default: 'Pending', 
    enum: ['Pending', 'In Progress', 'Approved', 'Rejected'] 
  },
  data: { 
    type: Object, 
    required: true 
  }, 
  attachments: [{ 
    type: String 
  }], 
  // NEW: Stores the path to the PDF certificate uploaded by Admin
  certificateUrl: {
    type: String,
    default: null
  },
  appliedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true }); // Added timestamps for better record tracking

module.exports = mongoose.model('Request', RequestSchema);