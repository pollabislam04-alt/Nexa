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

    // Get direct downlines (Level 1)
    const directDownlines = await User.find({ userId: { $in: user.downlines } })
      .select('userId userName walletAddress isActive joiningDate totalProfit directPartners totalTeam')
      .sort({ joiningDate: -1 });

    // Get all team members
    const getTeamRecursive = async (userIds) => {
      if (userIds.length === 0) return [];
      const users = await User.find({ userId: { $in: userIds } })
        .select('userId userName walletAddress isActive joiningDate totalProfit directPartners totalTeam downlines');
      
      let allTeam = [...users];
      for (let user of users) {
        if (user.downlines.length > 0) {
          const subTeam = await getTeamRecursive(user.downlines);
          allTeam = [...allTeam, ...subTeam];
        }
      }
      return allTeam;
    };

    const allTeam = await getTeamRecursive(user.downlines);

    const activeCount = directDownlines.filter(d => d.isActive).length;
    const inactiveCount = directDownlines.length - activeCount;

    res.json({
      userId: user.userId,
      userName: user.userName,
      directPartners: user.directPartners,
      totalTeam: user.totalTeam,
      activeMembers: activeCount,
      inactiveMembers: inactiveCount,
      directDownlines: directDownlines,
      allTeamCount: allTeam.length,
      topPerformers: directDownlines
        .sort((a, b) => b.totalProfit - a.totalProfit)
        .slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Team Tree (Hierarchy)
router.get('/tree/:walletAddress', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const buildTree = async (userId, level = 0) => {
      if (level > 5) return null; // Limit depth to 5 levels

      const userObj = await User.findOne({ userId })
        .select('userId userName totalProfit directPartners totalTeam downlines');
      
      if (!userObj) return null;

      const children = [];
      for (let downlineId of userObj.downlines.slice(0, 20)) { // Limit to 20 direct children
        const child = await buildTree(downlineId, level + 1);
        if (child) children.push(child);
      }

      return {
        userId: userObj.userId,
        userName: userObj.userName,
        totalProfit: userObj.totalProfit,
        directPartners: userObj.directPartners,
        totalTeam: userObj.totalTeam,
        level,
        childrenCount: userObj.downlines.length,
        children
      };
    };

    const tree = await buildTree(user.userId);

    res.json(tree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Team Statistics
router.get('/stats/:walletAddress', async (req, res) => {
  try {
    const user = await User.findOne({ walletAddress: req.params.walletAddress });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const directDownlines = await User.find({ userId: { $in: user.downlines } });
    
    const stats = {
      directPartners: user.directPartners,
      totalTeam: user.totalTeam,
      activeDirectMembers: directDownlines.filter(d => d.isActive).length,
      totalTeamProfit: directDownlines.reduce((sum, d) => sum + d.totalProfit, 0),
      averageDirectProfit: directDownlines.length > 0 
        ? directDownlines.reduce((sum, d) => sum + d.totalProfit, 0) / directDownlines.length 
        : 0,
      topEarner: directDownlines.length > 0
        ? directDownlines.reduce((max, d) => d.totalProfit > max.totalProfit ? d : max)
        : null
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
