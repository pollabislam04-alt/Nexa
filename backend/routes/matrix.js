const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get Slot Details
router.get('/slot/:walletAddress/:slotNumber', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const slot = user.activeSlots.find(s => s.slotNumber === parseInt(req.params.slotNumber));
    if (!slot) {
      return res.status(404).json({ error: 'Slot not active' });
    }

    res.json({
      slotNumber: slot.slotNumber,
      income: slot.income,
      mpsFoundationBalance: slot.mpsFoundationBalance,
      royaltyBalance: slot.royaltyBalance,
      purchaseDate: slot.purchaseDate,
      isActive: slot.isActive
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Income History for Slot
router.get('/income-history/:walletAddress/:slotNumber', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const slotNumber = parseInt(req.params.slotNumber);
    const history = user.incomeHistory.filter(h => {
      // This would need to be enhanced to track which slot the income came from
      return true;
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Commission Structure Info
router.get('/commission-structure', (req, res) => {
  const commissionStructure = [
    { level: 1, percentage: 50, description: 'Direct Partner' },
    { level: 2, percentage: 10 },
    { level: 3, percentage: 10 },
    { level: 4, percentage: 10 },
    { level: 5, percentage: 5 },
    { level: 6, percentage: 5 },
    { level: 7, percentage: 5, description: 'MPS Foundation (Slot Balance)' },
    { level: 8, percentage: 5, description: 'Royalty (Slot Balance)' }
  ];

  res.json({
    message: 'Commission is only paid if upline has the same slot active',
    structure: commissionStructure,
    note: 'MPS Foundation and Royalty balances are stored in the slot itself'
  });
});

// Get Matrix Data with Commission Details
router.get('/data/:walletAddress', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const slotDetails = user.activeSlots.map(slot => ({
      slotNumber: slot.slotNumber,
      income: slot.income,
      mpsFoundationBalance: slot.mpsFoundationBalance,
      royaltyBalance: slot.royaltyBalance,
      totalSlotBalance: slot.income + slot.mpsFoundationBalance + slot.royaltyBalance
    }));

    res.json({
      totalProfit: user.totalProfit,
      directPartners: user.directPartners,
      totalTeam: user.totalTeam,
      activeSlots: user.activeSlots.length,
      nexaSalary: user.nexaSalary,
      slotDetails: slotDetails
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
