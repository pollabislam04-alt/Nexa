const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Nexa Salary Levels
const salaryLevels = [
  { level: 1, teamSize: 200, directPartners: 20, percentage: 15 },
  { level: 2, teamSize: 500, directPartners: 40, percentage: 20 },
  { level: 3, teamSize: 1000, directPartners: 70, percentage: 30 },
  { level: 4, teamSize: 2000, directPartners: 150, percentage: 35 }
];

// Get User Salary Info
router.get('/:walletAddress', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate salary level
    let currentLevel = 0;
    let nextLevel = null;

    for (let i = 0; i < salaryLevels.length; i++) {
      const level = salaryLevels[i];
      if (user.totalTeam >= level.teamSize && user.directPartners >= level.directPartners) {
        currentLevel = level.level;
      } else if (!nextLevel) {
        nextLevel = level;
      }
    }

    res.json({
      userId: user.userId,
      userName: user.userName,
      currentLevel,
      currentSalaryPercentage: currentLevel > 0 ? salaryLevels[currentLevel - 1].percentage : 0,
      nexaSalary: user.nexaSalary,
      teamSize: user.totalTeam,
      directPartners: user.directPartners,
      nextLevelRequirements: nextLevel ? {
        level: nextLevel.level,
        teamSizeNeeded: nextLevel.teamSize - user.totalTeam,
        directPartnersNeeded: nextLevel.directPartners - user.directPartners,
        salaryPercentage: nextLevel.percentage
      } : null,
      salaryLevels
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate Projected Salary
router.post('/calculate', async (req, res) => {
  try {
    const { totalProfit, teamSize, directPartners } = req.body;

    let salaryPercentage = 0;
    for (let i = 0; i < salaryLevels.length; i++) {
      const level = salaryLevels[i];
      if (teamSize >= level.teamSize && directPartners >= level.directPartners) {
        salaryPercentage = level.percentage;
      }
    }

    const projectedSalary = (totalProfit * salaryPercentage) / 100;

    res.json({
      salaryPercentage,
      projectedSalary,
      message: `With ${teamSize} team members and ${directPartners} direct partners, you qualify for ${salaryPercentage}% salary`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
