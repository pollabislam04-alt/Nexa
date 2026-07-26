const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get User's Team
router.get('/:walletAddress', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get downline users
    const downlines = await User.find({ userId: { $in: user.downlines } })
      .select('userId userName walletAddress isActive joiningDate');

    const activeCount = downlines.filter(d => d.isActive).length;
    const inactiveCount = downlines.length - activeCount;

    res.json({
      directPartners: user.directPartners,
      totalTeam: user.totalTeam,
      activeMembers: activeCount,
      inactiveMembers: inactiveCount,
      downlines: downlines
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
