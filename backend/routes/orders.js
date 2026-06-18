const express = require('express');
const Order = require('../models/Order');
const { formatDoc, formatDocs } = require('../utils/formatResponse');
const { asyncHandler, isValidObjectId } = require('../utils/asyncHandler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
    if (req.query.isBulk === 'true') filter.isBulk = true;
    if (req.query.isBulk === 'false') filter.isBulk = false;
    if (req.query.search) {
      filter.$or = [
        { orderNumber: { $regex: req.query.search, $options: 'i' } },
        { customer: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const limit = req.query.limit ? parseInt(req.query.limit, 10) : undefined;
    let query = Order.find(filter).sort({ createdAt: -1 });

    if (limit) query = query.limit(limit);

    const orders = await query;
    res.json(formatDocs(orders));
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(formatDoc(order));
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const order = await Order.create(req.body);
    res.status(201).json(formatDoc(order));
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(formatDoc(order));
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order deleted', id: req.params.id });
  })
);

module.exports = router;
