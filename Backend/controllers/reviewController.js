import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

// @desc    Add a review to product
// @route   POST /api/products/:productId/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  // Validate input
  if (!rating || !comment) {
    res.status(400);
    throw new Error('Please provide both rating and comment');
  }
  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  // Check product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed
  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: req.user._id
  });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  // Create new review
  const review = await Review.create({
    product: productId,
    user: req.user._id,
    rating,
    comment
  });

  res.status(201).json({
    message: 'Review added successfully',
    review
  });
});



// @desc    Get product reviews
// @route   GET /api/products/:productId/reviews
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const reviews = await Review.find({ product: productId })
    .populate('user', 'name email') // optional: populate user info
    .sort({ createdAt: -1 });

  res.json({
    reviews,
    averageRating: product.rating,
    reviewCount: product.reviewCount
  });
});

// @desc    Update review helpful count
// @route   PUT /api/products/:productId/reviews/:reviewId/helpful
// @access  Private
const markReviewHelpful = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { isHelpful } = req.body;

  const review = await Review.findById(reviewId);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (isHelpful) review.helpful = (review.helpful || 0) + 1;
  else review.notHelpful = (review.notHelpful || 0) + 1;

  await review.save();

  res.json({ message: 'Review feedback updated', review });
});

// @desc    Delete a review
// @route   DELETE /api/products/:productId/reviews/:reviewId
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this review');
  }

  await review.remove();

  res.json({ message: 'Review removed successfully' });
});

export {
  addReview,
  getProductReviews,
  markReviewHelpful,
  deleteReview
};
