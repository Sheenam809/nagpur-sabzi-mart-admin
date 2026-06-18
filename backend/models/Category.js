const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    color: { type: String, default: 'bg-blue-100 dark:bg-blue-900/30' },
    products: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
