const express = require('express');
const Item = require('../models/Item');
const Claim = require('../models/Claim');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Aggregation-style reports for admin dashboard
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const byCategory = await Item.aggregate([
      { $match: { type: 'lost' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const byStatus = await Item.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const byType = await Item.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);
    const claimsByOutcome = await Claim.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({
      lostByCategory: Object.fromEntries(byCategory.map((x) => [x._id, x.count])),
      itemsByStatus: Object.fromEntries(byStatus.map((x) => [x._id, x.count])),
      itemsByType: Object.fromEntries(byType.map((x) => [x._id, x.count])),
      claimsByOutcome: Object.fromEntries(
        claimsByOutcome.map((x) => [x._id, x.count])
      ),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
