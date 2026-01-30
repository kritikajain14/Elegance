import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

// @desc    Get all products with optional filters
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { category, isNewArrival, isPopular, search } = req.query;
  
  let query = {};
  
  if (category) {
    query.category = category;
  }
  
  if (isNewArrival === 'true') {
    query.isNewArrival = true;
  }
  
  if (isPopular === 'true') {
    query.isPopular = true;
  }
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  const products = await Product.find(query);
  res.json(products);
});


// @desc    Get single product
// @route   GET /api/products/:productId
// @access  Public

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    { $inc: { views: 1 } },
    { new: true }
  ).populate('seller', 'name email');

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});



// @desc    Search products
// @route   GET /api/products/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
  
  let query = {
    status: 'approved',
    isApproved: true,
    stock: { $gt: 0 }
  };
  
  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } },
      { 'notes': { $regex: q, $options: 'i' } }
    ];
  }
  
  if (category) {
    query.category = category;
  }
  
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }
  
  const products = await Product.find(query)
    .populate('seller', 'name')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  
  const total = await Product.countDocuments(query);
  
  res.json({
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    totalProducts: total,
    searchQuery: q
  });
});  


// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isNewArrival: true }).limit(8);
  res.json(products);
});

// @desc    Get popular products
// @route   GET /api/products/popular
// @access  Public
const getPopularProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isPopular: true }).limit(8);
  res.json(products);
});

export {
  getProducts,
  getProductById,
  getNewArrivals,
  getPopularProducts, 
  searchProducts
};