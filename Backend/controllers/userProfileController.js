import asyncHandler from 'express-async-handler';
import UserProfile from '../models/UserProfile.js';
import User from '../models/User.js';
import cloudinary from 'cloudinary';
import Product from '../models/Product.js';


// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const profile = await UserProfile.findOne({ user: req.user._id })
    .populate('user', 'name email');
  
  if (!profile) {
    // Create default profile
    const defaultProfile = await UserProfile.create({
      user: req.user._id,
      sellerName: req.user.name
    });
    return res.json(defaultProfile);
  }
  
  res.json(profile);
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const {
    bio,
    location,
    website,
    socialLinks,
    shippingPolicy,
    returnPolicy,
    preferences
  } = req.body || {};
  
  let profile = await UserProfile.findOne({ user: req.user._id });
  
  if (!profile) {
    profile = new UserProfile({ user: req.user._id });
  }
  
  // Handle avatar upload
//   if (req.file) {
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: 'perfume-marketplace/avatars'
//     });
//     profile.avatar = result.secure_url;
//   }
  
  profile.bio = bio || profile.bio;
  profile.location = location || profile.location;
  profile.website = website || profile.website;
  profile.shippingPolicy = shippingPolicy || profile.shippingPolicy;
  profile.returnPolicy = returnPolicy || profile.returnPolicy;
  
  if (socialLinks) {
    profile.socialLinks = typeof socialLinks === 'string' 
      ? JSON.parse(socialLinks) 
      : socialLinks;
  }
  
  if (preferences) {
    profile.preferences = typeof preferences === 'string'
      ? JSON.parse(preferences)
      : preferences;
  }
  
  const updatedProfile = await profile.save();
  
  res.json({
    message: 'Profile updated successfully',
    profile: updatedProfile
  });
});

// @desc    Get seller public profile
// @route   GET /api/sellers/:userId
// @access  Public
const getSellerPublicProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const user = await User.findById(userId).select('name email');
  
  if (!user) {
    res.status(404);
    throw new Error('Seller not found');
  }
  
  const profile = await UserProfile.findOne({ user: userId });
  
  // Get seller's products
  const products = await Product.find({ 
    seller: userId, 
    status: 'approved',
    stock: { $gt: 0 }
  })
  .sort({ createdAt: -1 })
  .limit(12);
  
  // Get seller stats
  const stats = await Promise.all([
    Product.countDocuments({ seller: userId, status: 'approved', stock: { $gt: 0 } }),
    Product.countDocuments({ seller: userId, status: 'sold' }),
    Product.aggregate([
      { $match: { seller: userId, status: 'sold' } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$soldCount'] } } } }
    ])
  ]);
  
  res.json({
    seller: user,
    profile: profile || {},
    products,
    stats: {
      activeProducts: stats[0] || 0,
      soldProducts: stats[1] || 0,
      totalSales: stats[2]?.[0]?.total || 0
    }
  });
});

// @desc    Get seller's products
// @route   GET /api/sellers/:userId/products
// @access  Public
const getSellerProducts = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 12, category, sort = 'newest' } = req.query;
  
  const query = { 
    seller: userId, 
    status: 'approved',
    stock: { $gt: 0 }
  };
  
  if (category) {
    query.category = category;
  }
  
  let sortOption = {};
  switch (sort) {
    case 'price-low':
      sortOption = { price: 1 };
      break;
    case 'price-high':
      sortOption = { price: -1 };
      break;
    case 'popular':
      sortOption = { views: -1 };
      break;
    default:
      sortOption = { createdAt: -1 };
  }
  
  const products = await Product.find(query)
    .sort(sortOption)
    .limit(limit * 1)
    .skip((page - 1) * limit);
  
  const total = await Product.countDocuments(query);
  
  res.json({
    products,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    totalProducts: total
  });
});

export {
  getUserProfile,
  updateUserProfile,
  getSellerPublicProfile,
  getSellerProducts
};