const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sold: { type: Number, min: 0, default: 0 },
    image: { type: String, default: '' },
    status: {
      type: String,
      enum: ['active', 'low_stock', 'out_of_stock', 'inactive'],
      default: 'active',
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, min: 0, default: 0 },
    trending: { type: Boolean, default: false },
    lowStockThreshold: { type: Number, min: 0, default: 20 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
