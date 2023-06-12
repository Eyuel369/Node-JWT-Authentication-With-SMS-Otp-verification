const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rent_start_time: {
    type: Date,
    required: true
  },
  rent_end_time: {
    type: Date,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Accepted', 'In Progress', 'Rejected'],
    default: 'In Progress'
  }
});

module.exports = mongoose.model('Contract', contractSchema);
