const express = require('express');
const router = express.Router();
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Product routes
router.post('/', addProduct);           // Create product
router.get('/', getProducts);           // Get all products with filters
router.get('/:id', getProductById);     // Get single product
router.put('/:id', updateProduct);      // Update product
router.delete('/:id', deleteProduct);   // Delete product

module.exports = router;