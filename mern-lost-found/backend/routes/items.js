const express = require('express');
const Item = require('../models/Item');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/items
// Query: q, type, category, status
router.get('/', async (req, res) => {
  try {
    const { q, type, category, status } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
      ];
    }
    const items = await Item.find(filter)
      .populate('postedBy', 'name email usn')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/items/stats/summary  (before /:id)
router.get('/stats/summary', async (req, res) => {
  try {
    const [total, open, claimPending, returned, lost, found] = await Promise.all([
      Item.countDocuments(),
      Item.countDocuments({ status: 'open' }),
      Item.countDocuments({ status: 'claim_pending' }),
      Item.countDocuments({ status: 'returned' }),
      Item.countDocuments({ type: 'lost' }),
      Item.countDocuments({ type: 'found' }),
    ]);
    res.json({ total, open, claimPending, returned, lost, found });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/items/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'postedBy',
      'name email usn'
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/items
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, type, category, location, date, photo } = req.body;
    if (!title || !description || !type || !category || !location || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const item = await Item.create({
      title,
      description,
      type,
      category,
      location,
      date,
      photo: photo || null,
      postedBy: req.user._id,
      status: 'open',
    });

    // Suggest match: opposite type, same category, still open
    const match = await Item.findOne({
      _id: { $ne: item._id },
      type: type === 'lost' ? 'found' : 'lost',
      category,
      status: { $ne: 'returned' },
    });
    if (match) {
      await Notification.create({
        user: req.user._id,
        item: item._id,
        message: `Possible match for "${title}": ${match.title}`,
      });
    }

    const populated = await item.populate('postedBy', 'name email usn');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
