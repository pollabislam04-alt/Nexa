const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
};

// Register User
router.post('/register', async (req, res) => {
  try {
    const { walletAddress, userName, referrerId } = req.body;

    const existingUser = await User.findOne({ walletAddress });
    if (existingUser) {
      return res.status(400).json({ error: 'Wallet already registered' });
    }

    // Get next user ID
    const lastUser = await User.findOne().sort({ userId: -1 });
    const newUserId = lastUser ? lastUser.userId + 1 : 1;

    const user = new User({
      userId: newUserId,
      walletAddress,
      userName,
      referrerId: referrerId || 1,
      isActive: true
    });

    await user.save();

    // Update referrer's downlines
    if (referrerId && referrerId !== 0) {
      await User.findOneAndUpdate(
        { userId: referrerId },
        {
          $push: { downlines: newUserId },
          $inc: { directPartners: 1, totalTeam: 1 }
        }
      );
    }

    const token = generateToken(newUserId);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        userId: user.userId,
        walletAddress: user.walletAddress,
        userName: user.userName,
        referrerId: user.referrerId
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { walletAddress } = req.body;

    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const token = generateToken(user.userId);

    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.userId,
        walletAddress: user.walletAddress,
        userName: user.userName
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
