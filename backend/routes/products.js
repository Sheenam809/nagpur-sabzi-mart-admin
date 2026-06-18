const express = require('express');
const Product = require('../models/Product');
const { formatDoc, formatDocs } = require('../utils/formatResponse');
const { asyncHandler, isValidObjectId } = require('../utils/asyncHandler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.trending === 'true') filter.trending = true;
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(formatDocs(products));
  })
);

router.get(
  '/low-stock',
  asyncHandler(async (_req, res) => {
    const products = await Product.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
    }).sort({ stock: 1 });

    const items = formatDocs(products).map((product) => ({
      id: product.id,
      name: product.name,
      stock: product.stock,
      threshold: product.lowStockThreshold,
      unit: product.unit,
      image: product.image,
      category: product.category,
    }));

    res.json(items);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(formatDoc(product));
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json(formatDoc(product));
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(formatDoc(product));
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted', id: req.params.id });
  })
);

module.exports = router;
