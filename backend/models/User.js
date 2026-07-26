const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  activeSlots: [
    {
      slotNumber: Number,
      purchaseDate: Date,
      income: Number
    }
  ],
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
