const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Helper function for error handling
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Get all items with pagination
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Item.countDocuments();
    const items = await Item.find().limit(limit).skip(startIndex);

    res.json({
      items,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  })
);

// Create a new item
router.post(
  '/',
  asyncHandler(async (req, res) => {
    const { name, description, quantity } = req.body;

    if (!name || typeof quantity !== 'number') {
      return res
        .status(400)
        .json({ message: 'Name and valid quantity are required' });
    }

    const newItem = new Item({ name, description, quantity });
    await newItem.save();
    res.status(201).json(newItem);
  })
);

// Update an item
router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const { name, description, quantity } = req.body;
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, description, quantity },
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  })
);

// Delete an item
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  })
);

// Get total quantity of all items
router.get(
  '/total-quantity',
  asyncHandler(async (req, res) => {
    const result = await Item.aggregate([
      { $group: { _id: null, totalQuantity: { $sum: '$quantity' } } },
    ]);
    const totalQuantity = result.length > 0 ? result[0].totalQuantity : 0;
    res.json({ totalQuantity });
  })
);

module.exports = router;
// server/src/routes/ItemRoutes.js