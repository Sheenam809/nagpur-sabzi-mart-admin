const express = require('express');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { formatDoc, formatDocs } = require('../utils/formatResponse');
const { asyncHandler, isValidObjectId } = require('../utils/asyncHandler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const categories = await Category.find().sort({ name: 1 });
    res.json(formatDocs(categories));
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid category id' });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(formatDoc(category));
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const category = await Category.create(req.body);
    res.status(201).json(formatDoc(category));
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid category id' });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(formatDoc(category));
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid category id' });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const productCount = await Product.countDocuments({ category: category.name });
    if (productCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete category with products. Move products to another category first.',
        products: productCount,
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted', id: req.params.id });
  })
);

module.exports = router;
