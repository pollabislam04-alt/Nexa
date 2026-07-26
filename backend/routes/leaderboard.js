const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get Leaderboard (Weekly)
router.get('/weekly', async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const leaderboard = await User.find({ joiningDate: { $gte: sevenDaysAgo } })
      .sort({ totalProfit: -1 })
      .limit(20)
      .select('userId userName totalProfit directPartners');

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Time Leaderboard
router.get('/all-time', async (req, res) => {
  try {
    const leaderboard = await User.find()
      .sort({ totalProfit: -1 })
      .limit(20)
      .select('userId userName totalProfit directPartners');

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
