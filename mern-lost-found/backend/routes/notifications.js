const express = require('express');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notifications
router.get('/', protect, async (req, res) => {
  try {
    const notes = await Notification.find({ user: req.user._id })
      .populate('item', 'title type status')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PATCH /api/notifications/read-all
router.patch('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PATCH /api/notifications/:id/read
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const note = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!note) return res.status(404).json({ message: 'Not found' });
    note.read = true;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
