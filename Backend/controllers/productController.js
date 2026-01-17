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
  const product = await Product.findById(req.params.productId);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
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
  getPopularProducts
};