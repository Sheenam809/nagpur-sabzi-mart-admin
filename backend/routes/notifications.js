const express = require('express');
const Notification = require('../models/Notification');
const { formatDoc, formatDocs } = require('../utils/formatResponse');
const { asyncHandler, isValidObjectId } = require('../utils/asyncHandler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = {};

    if (req.query.type) filter.type = req.query.type;
    if (req.query.read === 'true') filter.read = true;
    if (req.query.read === 'false') filter.read = false;

    const notifications = await Notification.find(filter).sort({ createdAt: -1 });
    res.json(formatDocs(notifications));
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid notification id' });
    }

    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(formatDoc(notification));
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const notification = await Notification.create(req.body);
    res.status(201).json(formatDoc(notification));
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid notification id' });
    }

    const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(formatDoc(notification));
  })
);

router.patch(
  '/:id/read',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid notification id' });
    }

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(formatDoc(notification));
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid notification id' });
    }

    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted', id: req.params.id });
  })
);

module.exports = router;
