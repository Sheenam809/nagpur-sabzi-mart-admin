const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, trim: true },
    orderRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    customer: { type: String, required: true, trim: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    amount: { type: Number, required: true, min: 0 },
    method: {
      type: String,
      enum: ['UPI', 'Card', 'COD', 'Wallet', 'Net Banking'],
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'pending', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: { type: String, required: true, unique: true, trim: true },
    gateway: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
