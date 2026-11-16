const express = require('express');
const Claim = require('../models/Claim');
const Item = require('../models/Item');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/claims
router.post('/', protect, async (req, res) => {
  try {
    const { itemId, proof } = req.body;
    if (!itemId || !proof?.trim()) {
      return res.status(400).json({ message: 'Item and proof are required' });
    }
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.type !== 'found') {
      return res.status(400).json({ message: 'Only found items can be claimed' });
    }
    if (item.status === 'returned') {
      return res.status(400).json({ message: 'Item already returned' });
    }
    if (String(item.postedBy) === String(req.user._id)) {
      return res.status(400).json({ message: 'Cannot claim your own item' });
    }
    const existing = await Claim.findOne({
      item: itemId,
      claimant: req.user._id,
    });
    if (existing) {
      return res.status(400).json({ message: 'You already claimed this item' });
    }

    const claim = await Claim.create({
      item: itemId,
      claimant: req.user._id,
      proof: proof.trim(),
      status: 'pending',
    });
    item.status = 'claim_pending';
    await item.save();

    // Notify poster
    await Notification.create({
      user: item.postedBy,
      item: itemId,
      message: `Someone has submitted a claim on your found item: ${item.title}`,
    });
    // Notify admins
    const admins = await User.find({ role: 'admin' });
    await Promise.all(
      admins.map((a) =>
        Notification.create({
          user: a._id,
          item: itemId,
          message: `New claim awaiting review: ${item.title}`,
        })
      )
    );

    const populated = await claim.populate([
      { path: 'item', select: 'title type category location status' },
      { path: 'claimant', select: 'name email usn' },
    ]);
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/claims/mine
router.get('/mine', protect, async (req, res) => {
  try {
    const claims = await Claim.find({ claimant: req.user._id })
      .populate('item', 'title type category location status photo')
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/claims/pending  (admin)
router.get('/pending', protect, adminOnly, async (req, res) => {
  try {
    const claims = await Claim.find({ status: 'pending' })
      .populate('item', 'title type category location status postedBy')
      .populate('claimant', 'name email usn')
      .populate({ path: 'item', populate: { path: 'postedBy', select: 'name' } })
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/claims  (admin - all)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate('item', 'title type category')
      .populate('claimant', 'name email')
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PATCH /api/claims/:id/decide  (admin)
router.patch('/:id/decide', protect, adminOnly, async (req, res) => {
  try {
    const { approve, remark } = req.body;
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    if (claim.status !== 'pending') {
      return res.status(400).json({ message: 'Claim already decided' });
    }

    const item = await Item.findById(claim.item);
    claim.status = approve ? 'approved' : 'rejected';
    claim.remark =
      remark?.trim() || (approve ? 'Proof verified' : 'Details did not match');
    await claim.save();

    if (approve) {
      item.status = 'returned';
    } else {
      const stillPending = await Claim.exists({
        item: item._id,
        status: 'pending',
      });
      if (!stillPending) item.status = 'open';
    }
    await item.save();

    await Notification.create({
      user: claim.claimant,
      item: item._id,
      message: approve
        ? `Your claim on ${item.title} was approved. Please collect it from the department office.`
        : `Your claim on ${item.title} was rejected`,
    });

    const populated = await claim.populate([
      { path: 'item', select: 'title status' },
      { path: 'claimant', select: 'name email' },
    ]);
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
