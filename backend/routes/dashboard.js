const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get Dashboard Data
router.get('/:walletAddress', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        userId: user.userId,
        userName: user.userName,
        walletAddress: user.walletAddress,
        profileImage: user.profileImage,
        joiningDate: user.joiningDate
      },
      stats: {
        totalProfit: user.totalProfit,
        directPartners: user.directPartners,
        totalTeam: user.totalTeam,
        nexaSalary: user.nexaSalary,
        activeSlots: user.activeSlots.length
      },
      referralCode: `USER_${user.userId}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
