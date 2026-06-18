const express = require('express');
const BulkOrder = require('../models/BulkOrder');
const { formatDoc, formatDocs } = require('../utils/formatResponse');
const { asyncHandler, isValidObjectId } = require('../utils/asyncHandler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { orderNumber: { $regex: req.query.search, $options: 'i' } },
        { customer: { $regex: req.query.search, $options: 'i' } },
        { businessName: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const bulkOrders = await BulkOrder.find(filter).sort({ createdAt: -1 });
    res.json(formatDocs(bulkOrders));
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid bulk order id' });
    }

    const bulkOrder = await BulkOrder.findById(req.params.id);
    if (!bulkOrder) {
      return res.status(404).json({ message: 'Bulk order not found' });
    }

    res.json(formatDoc(bulkOrder));
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const bulkOrder = await BulkOrder.create(req.body);
    res.status(201).json(formatDoc(bulkOrder));
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid bulk order id' });
    }

    const bulkOrder = await BulkOrder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bulkOrder) {
      return res.status(404).json({ message: 'Bulk order not found' });
    }

    res.json(formatDoc(bulkOrder));
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid bulk order id' });
    }

    const bulkOrder = await BulkOrder.findByIdAndDelete(req.params.id);
    if (!bulkOrder) {
      return res.status(404).json({ message: 'Bulk order not found' });
    }

    res.json({ message: 'Bulk order deleted', id: req.params.id });
  })
);

module.exports = router;
