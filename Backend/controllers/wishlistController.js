import asyncHandler from 'express-async-handler';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user._id })
    .populate({
      path: 'items.productId',
      select: 'name description price originalPrice images category size isNewArrival isPopular rating'
    })
    .sort({ 'items.addedAt': -1 });

  if (!wishlist) {
    return res.json({ items: [], userId: req.user._id });
  }

  res.json(wishlist);
});

// @desc    Add item to wishlist
// @route   POST /api/wishlist/add
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let wishlist = await Wishlist.findOne({ userId: req.user._id });

  if (!wishlist) {
    // Create new wishlist
    wishlist = await Wishlist.create({
      userId: req.user._id,
      items: [{ productId }]
    });
  } else {
    // Check if product already in wishlist
    const existingItem = wishlist.items.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      res.status(400);
      throw new Error('Product already in wishlist');
    }

    // Add new item
    wishlist.items.push({ productId });
    await wishlist.save();
  }

  const updatedWishlist = await Wishlist.findOne({ userId: req.user._id })
    .populate({
      path: 'items.productId',
      select: 'name description price originalPrice images category size isNewArrival isPopular rating'
    });

  res.status(201).json({
    message: 'Added to wishlist',
    wishlist: updatedWishlist
  });
});

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ userId: req.user._id });

  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  // Remove item
  wishlist.items = wishlist.items.filter(
    item => item.productId.toString() !== productId
  );

  await wishlist.save();

  const updatedWishlist = await Wishlist.findOne({ userId: req.user._id })
    .populate({
      path: 'items.productId',
      select: 'name description price originalPrice images category size isNewArrival isPopular rating'
    });

  res.json({
    message: 'Removed from wishlist',
    wishlist: updatedWishlist
  });
});

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
const checkInWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ userId: req.user._id });

  if (!wishlist) {
    return res.json({ inWishlist: false });
  }

  const inWishlist = wishlist.items.some(
    item => item.productId.toString() === productId
  );

  res.json({ inWishlist });
});

// @desc    Clear wishlist
// @route   DELETE /api/wishlist/clear
// @access  Private
const clearWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user._id });

  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  wishlist.items = [];
  await wishlist.save();

  res.json({
    message: 'Wishlist cleared',
    wishlist
  });
});

export {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkInWishlist,
  clearWishlist
};