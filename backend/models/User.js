const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  slotNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  income: {
    type: Number,
    default: 0
  },
  mpsFoundationBalance: {
    type: Number,
    default: 0
  },
  royaltyBalance: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const incomeHistorySchema = new mongoose.Schema({
  level: {
    type: Number,
    min: 1,
    max: 8
  },
  amount: Number,
  incomeType: {
    type: String,
    enum: ['commission', 'mps_foundation', 'royalty']
  },
  fromUser: Number,
  fromWallet: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true,
    required: true
  },
  walletAddress: {
    type: String,
    unique: true,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  email: String,
  profileImage: String,
  joiningDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: false
  },
  referrerId: {
    type: Number,
    default: 1
  },
  totalProfit: {
    type: Number,
    default: 0
  },
  directPartners: {
    type: Number,
    default: 0
  },
  totalTeam: {
    type: Number,
    default: 0
  },
  activeSlots: [slotSchema],
  incomeHistory: [incomeHistorySchema],
  nexaSalary: {
    type: Number,
    default: 0
  },
  salaryLevel: {
    type: Number,
    default: 0
  },
  downlines: [Number],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
