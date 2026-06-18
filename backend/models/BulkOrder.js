const mongoose = require('mongoose');

const bulkOrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, trim: true },
    customer: { type: String, required: true, trim: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    businessName: { type: String, required: true, trim: true },
    items: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Placed', 'Confirmed', 'Packed', 'In Transit', 'Delivered', 'Cancelled'],
      default: 'Placed',
    },
    deliveryDate: { type: Date, required: true },
    contactPhone: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BulkOrder', bulkOrderSchema);
