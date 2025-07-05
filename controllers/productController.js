const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

// Helper to generate auto-increment ID
const generateNextProdID = async () => {
  const lastProduct = await Product.findOne().sort({ createdAt: -1 });
  let nextNumber = 1;

  if (lastProduct && typeof lastProduct._id === 'string' && lastProduct._id.startsWith('PROD-')) {
    const lastNum = parseInt(lastProduct._id.split('-')[1]);
    if (!isNaN(lastNum)) nextNumber = lastNum + 1;
  }

  return `PROD-${String(nextNumber).padStart(4, '0')}`;
};

// Add new product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, quantity, categories } = req.body;

    // Check if product name already exists
    const existing = await Product.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Product name must be unique' });

    // Validate categories exist in database
    if (categories && categories.length > 0) {
      const categoryDocs = await Category.find({ name: { $in: categories } });
      if (categoryDocs.length !== categories.length) {
        return res.status(400).json({ message: 'One or more categories do not exist' });
      }
    }

    // Generate product ID
    const prodID = await generateNextProdID();

    const product = new Product({
      _id: prodID,
      prodID,
      name,
      description,
      quantity,
      categories: categories || [], // Store category names directly
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all products with search and category filters
exports.getProducts = async (req, res) => {
  try {
    const { search = '', category: catFilter = [] } = req.query;
    
    // Convert category filter to array if it's a single string
    const categories = Array.isArray(catFilter) ? catFilter : (catFilter ? [catFilter] : []);
    
    const filter = {};
    
    // Apply search filter (case-insensitive)
    if (search) {
      filter.name = new RegExp(search, 'i');
    }
    
    // Apply category filter - categories are stored as strings (names)
    if (categories.length && categories[0]) {
      filter.categories = { $in: categories };
    }
    
    // Find products and sort by creation date
    const products = await Product.find(filter).sort({ createdAt: -1 });
    
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, quantity, categories } = req.body;

    // Check if another product with same name exists
    const existing = await Product.findOne({ name });
    if (existing && existing._id !== id) {
      return res.status(400).json({ message: 'Product name must be unique' });
    }

    // Validate categories exist in database
    if (categories && categories.length > 0) {
      const categoryDocs = await Category.find({ name: { $in: categories } });
      if (categoryDocs.length !== categories.length) {
        return res.status(400).json({ message: 'One or more categories do not exist' });
      }
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        quantity,
        categories: categories || []
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Product not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};