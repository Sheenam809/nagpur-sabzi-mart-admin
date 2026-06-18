const mongoose = require('mongoose');

const orderedProductSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, trim: true },
    customer: { type: String, required: true, trim: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    phone: { type: String, trim: true },
    customerAvatar: { type: String, default: '' },
    items: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Placed', 'Confirmed', 'Packed', 'In Transit', 'Delivered', 'Cancelled'],
      default: 'Placed',
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    deliveryAddress: { type: String, required: true, trim: true },
    deliveryTime: { type: Date },
    paymentMethod: { type: String, required: true, trim: true },
    isBulk: { type: Boolean, default: false },
    orderedProducts: [orderedProductSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
