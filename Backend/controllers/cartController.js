import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id })
    .populate('items.productId');
  
  if (!cart) {
    return res.json({ items: [], userId: req.user._id });
  }
  
  res.json(cart);
});

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private


const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  
  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Check stock
  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Insufficient stock');
  }
  
  let cart = await Cart.findOne({ userId: req.user._id });
  
  if (!cart) {
    // Create new cart
    cart = await Cart.create({
      userId: req.user._id,
      items: [{ productId, quantity }]
    });
  } else {
    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ productId, quantity });
    }
    
    await cart.save();
  }
  
  const updatedCart = await Cart.findOne({ userId: req.user._id })
    .populate('items.productId');
  
  res.status(201).json(updatedCart);
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  
  if (quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }
  
  const cart = await Cart.findOne({ userId: req.user._id });
  
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  
  const itemIndex = cart.items.findIndex(
    item => item.productId.toString() === productId
  );
  
  if (itemIndex === -1) {
    res.status(404);
    throw new Error('Item not found in cart');
  }
  
  // Check stock
  const product = await Product.findById(productId);
  if (product.stock < quantity) {
    res.status(400);
    throw new Error('Insufficient stock');
  }
  
  cart.items[itemIndex].quantity = quantity;
  await cart.save();
  
  const updatedCart = await Cart.findOne({ userId: req.user._id })
    .populate('items.productId');
  
  res.json(updatedCart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  
  const cart = await Cart.findOne({ userId: req.user._id });
  
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  
  cart.items = cart.items.filter(
    item => item.productId.toString() !== productId
  );
  
  await cart.save();
  
  const updatedCart = await Cart.findOne({ userId: req.user._id })
    .populate('items.productId');
  
  res.json(updatedCart);
});

export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};