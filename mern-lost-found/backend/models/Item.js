const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    type: { type: String, enum: ['lost', 'found'], required: true },
    category: {
      type: String,
      enum: [
        'ID Card',
        'Electronics',
        'Books & Stationery',
        'Accessories',
        'Documents',
        'Personal items',
        'Others',
      ],
      required: true,
    },
    location: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['open', 'claim_pending', 'returned', 'archived'],
      default: 'open',
    },
    photo: { type: String, default: null }, // base64 or URL
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

itemSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Item', itemSchema);
