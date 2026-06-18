const express = require('express');
const Payment = require('../models/Payment');
const { formatDoc, formatDocs } = require('../utils/formatResponse');
const { asyncHandler, isValidObjectId } = require('../utils/asyncHandler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.method) filter.method = req.query.method;
    if (req.query.orderId) filter.orderId = req.query.orderId;

    const payments = await Payment.find(filter).sort({ createdAt: -1 });
    res.json(formatDocs(payments));
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid payment id' });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(formatDoc(payment));
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const payment = await Payment.create(req.body);
    res.status(201).json(formatDoc(payment));
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid payment id' });
    }

    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(formatDoc(payment));
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid payment id' });
    }

    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({ message: 'Payment deleted', id: req.params.id });
  })
);

module.exports = router;
