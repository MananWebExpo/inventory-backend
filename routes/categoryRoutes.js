const express = require('express');
const router = express.Router();
const Category = require('../models/categoryModel');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

module.exports = router;
