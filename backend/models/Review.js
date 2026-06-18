const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    customer: { type: String, required: true, trim: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    customerAvatar: { type: String, default: '' },
    product: { type: String, required: true, trim: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productImage: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['published', 'pending', 'flagged'],
      default: 'pending',
    },
    helpful: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
