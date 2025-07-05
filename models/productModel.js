const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  prodID: String, // duplicate field for querying if needed
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  quantity: {
    type: Number,
    required: true
  },
  categories: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
