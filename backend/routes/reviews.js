const express = require('express');
const Review = require('../models/Review');
const { formatDoc, formatDocs } = require('../utils/formatResponse');
const { asyncHandler, isValidObjectId } = require('../utils/asyncHandler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.productId && isValidObjectId(req.query.productId)) {
      filter.productId = req.query.productId;
    }
    if (req.query.rating) filter.rating = parseInt(req.query.rating, 10);

    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json(formatDocs(reviews));
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(formatDoc(review));
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const review = await Review.create(req.body);
    res.status(201).json(formatDoc(review));
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(formatDoc(review));
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted', id: req.params.id });
  })
);

module.exports = router;
