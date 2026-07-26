const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Activate Slot
router.post('/activate-slot', async (req, res) => {
  try {
    const { walletAddress, slotNumber } = req.body;

    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if previous slot is activated
    if (slotNumber > 1) {
      const hasPreviousSlot = user.activeSlots.some(s => s.slotNumber === slotNumber - 1);
      if (!hasPreviousSlot) {
        return res.status(400).json({ error: 'Previous slot must be activated first' });
      }
    }

    const slotExists = user.activeSlots.some(s => s.slotNumber === slotNumber);
    if (slotExists) {
      return res.status(400).json({ error: 'Slot already activated' });
    }

    user.activeSlots.push({
      slotNumber,
      purchaseDate: new Date(),
      income: 0
    });

    await user.save();

    res.json({ message: 'Slot activated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Matrix Data
router.get('/data/:walletAddress', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      totalProfit: user.totalProfit,
      directPartners: user.directPartners,
      totalTeam: user.totalTeam,
      activeSlots: user.activeSlots,
      nexaSalary: user.nexaSalary
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
