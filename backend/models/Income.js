const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  walletAddress: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  incomeType: {
    type: String,
    enum: ['direct', 'team', 'matrix', 'salary'],
    required: true
  },
  sourceUserId: Number,
  description: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Income', incomeSchema);
