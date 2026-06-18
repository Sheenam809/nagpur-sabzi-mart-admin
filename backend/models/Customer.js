const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    avatar: { type: String, default: '' },
    location: { type: String, required: true, trim: true },
    totalOrders: { type: Number, min: 0, default: 0 },
    totalSpent: { type: Number, min: 0, default: 0 },
    lastOrder: { type: Date },
    status: {
      type: String,
      enum: ['active', 'inactive', 'new'],
      default: 'new',
    },
    joinedAt: { type: Date, default: Date.now },
    loyaltyPoints: { type: Number, min: 0, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
