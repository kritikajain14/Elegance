import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';
import { cloudinary } from '../utils/cloudinary.js';  

// @desc    Get user's products
// @route   GET /api/user/products
// @access  Private
const getUserProducts = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  
  const query = { seller: req.user._id };
  
  if (status) {
    query.status = status;
  }
  
  const products = await Product.find(query)
    .sort({ createdAt: -1 })
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

// @desc    Create a new product
// @route   POST /api/user/products
// @access  Private


const createProduct = asyncHandler(async (req, res) => {
  console.log('=== CREATE PRODUCT ENDPOINT HIT ===');
  console.log('req.body:', req.body);
  console.log('req.files:', req.files);
  
  // Normalize form field names (trim whitespace from keys)
  const normalizedBody = {};
  for (const [key, value] of Object.entries(req.body)) {
    normalizedBody[key.trim()] = value;
  }
  
  const {
    name,
    description,
    longDescription,
    price,
    originalPrice,
    category,
    size,
    stock,
    condition,
    brand,
    notes,
    concentration,
    releaseYear
  } = normalizedBody;

    console.log('Price received:', price, 'Type:', typeof price);
  
  const parsedPrice = Number(price);
  const parsedOriginalPrice = originalPrice
    ? Number(originalPrice)
    : parsedPrice;

  console.log('Parsed price:', parsedPrice, 'isNaN:', isNaN(parsedPrice));

  if (isNaN(parsedPrice)) {
    res.status(400);
    throw new Error('Price must be a valid number');
  }
  
  // Get user
  const user = await User.findById(req.user._id);
  
  // Upload images to Cloudinary
  let images = [];
 try {
    if (req.files && req.files.length > 0) {
      images = await Promise.all(
        req.files.map(async (file) => {
          console.log('Uploading:', file.path);

          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'perfume-marketplace/products'
          });

          console.log('Cloudinary success:', result.secure_url);
          return result.secure_url;
        })
      );
    }
  } catch (error) {
    console.error('❌ CLOUDINARY FAILED:', error);
    res.status(500);
    throw new Error('Cloudinary upload failed');
  }
  
  if (images.length === 0) {
    res.status(400);
    throw new Error('At least one image is required');
  }
  
  const product = await Product.create({
    name,
    description,
    longDescription,
    price: parsedPrice,
    originalPrice: parsedOriginalPrice,
    category,
    size,
    stock: parseInt(stock),
    images,
    seller: req.user._id,
    sellerName: user.name,
    condition,
    brand,
    notes: notes ? notes.split(',').map(note => note.trim()) : [],
    concentration,
    releaseYear: releaseYear ? parseInt(releaseYear) : null,
    status: 'pending', // Needs admin approval for marketplace
    isApproved: false
  });

  console.log('REQ BODY:', req.body); // Debugging

  
  // Update user profile product count
  await UserProfile.findOneAndUpdate(
    { user: req.user._id },
    { $inc: { totalProducts: 1 } },
    { upsert: true }
  );
  
  res.status(201).json({
    message: 'Product created successfully. Awaiting admin approval.',
    product
  });
});

// @desc    Update a product
// @route   PUT /api/user/products/:productId
// @access  Private
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Check if user owns the product
  if (product.seller.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this product');
  }
  
  // Don't allow updates if product is sold
  if (product.status === 'sold') {
    res.status(400);
    throw new Error('Cannot update a sold product');
  }
  
  const {
    name,
    description,
    longDescription,
    price,
    originalPrice,
    category,
    size,
    stock,
    condition,
    brand,
    notes,
    concentration,
    releaseYear,
    status
  } = req.body;
  
  // Handle image updates
  let images = product.images;
  if (req.files && req.files.length > 0) {
    // Upload new images
    const newImages = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'perfume-marketplace/products'
        });
        return result.secure_url;
      })
    );
    images = [...images, ...newImages];
  }
  
  // Update product
  product.name = name || product.name;
  product.description = description || product.description;
  product.longDescription = longDescription || product.longDescription;
  product.price = price ? parseFloat(price) : product.price;
  product.originalPrice = originalPrice ? parseFloat(originalPrice) : product.originalPrice;
  product.category = category || product.category;
  product.size = size || product.size;
  product.stock = stock ? parseInt(stock) : product.stock;
  product.images = images;
  product.condition = condition || product.condition;
  product.brand = brand || product.brand;
  product.notes = notes ? notes.split(',').map(note => note.trim()) : product.notes;
  product.concentration = concentration || product.concentration;
  product.releaseYear = releaseYear ? parseInt(releaseYear) : product.releaseYear;
  product.status = status || product.status;
  
  // If status changed to pending, reset approval
  if (status === 'pending') {
    product.isApproved = false;
  }
  
  const updatedProduct = await product.save();
  
  res.json({
    message: 'Product updated successfully',
    product: updatedProduct
  });
});

// @desc    Delete a product
// @route   DELETE /api/user/products/:id
// @access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Check if user owns the product
  if (product.seller.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this product');
  }
  
  // Don't allow deletion if product has orders
  if (product.soldCount > 0) {
    res.status(400);
    throw new Error('Cannot delete a product with sales');
  }
  
  // Delete images from Cloudinary
  await Promise.all(
    product.images.map(async (imageUrl) => {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`perfume-marketplace/products/${publicId}`);
    })
  );
  
  await product.deleteOne();
  
  // Update user profile product count
  await UserProfile.findOneAndUpdate(
    { user: req.user._id },
    { $inc: { totalProducts: -1 } }
  );
  
  res.json({
    message: 'Product removed successfully'
  });
});

// @desc    Get product by ID (user's view)
// @route   GET /api/user/products/:productId
// @access  Private
const getUserProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Check if user owns the product
  if (product.seller.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to view this product');
  }
  
  res.json(product);
});

// @desc    Activate (approve) own product
// @route   PUT /api/user/products/:productId/activate
// @access  Private (owner only)
export const activateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Ensure product belongs to logged-in user
  if (product.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to activate this product');
  }

  product.status = 'approved';
  await product.save();

  res.json({
    success: true,
    message: 'Product activated successfully',
    product
  });
});


// @desc    Get user's dashboard stats
// @route   GET /api/user/dashboard/stats
// @access  Private
const getUserDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalProducts,
    activeProducts,
    pendingProducts,
    soldProducts,
    totalSales,
    totalViews
  ] = await Promise.all([
    Product.countDocuments({ seller: req.user._id }),
    Product.countDocuments({ seller: req.user._id, status: 'approved', stock: { $gt: 0 } }),
    Product.countDocuments({ seller: req.user._id, status: 'pending' }),
    Product.countDocuments({ seller: req.user._id, status: 'sold' }),
    Product.aggregate([
      { $match: { seller: req.user._id, status: 'sold' } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$soldCount'] } } } }
    ]),
    Product.aggregate([
      { $match: { seller: req.user._id } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ])
  ]);
  
  const userProfile = await UserProfile.findOne({ user: req.user._id });
  
  res.json({
    stats: {
      totalProducts,
      activeProducts,
      pendingProducts,
      soldProducts,
      totalSales: totalSales[0]?.total || 0,
      totalViews: totalViews[0]?.total || 0,
      sellerRating: userProfile?.sellerRating || 0,
      balance: userProfile?.balance || 0
    }
  });
});

// @desc    Update product images
// @route   PUT /api/user/products/:productId/images
// @access  Private
const updateProductImages = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Check if user owns the product
  if (product.seller.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this product');
  }
  
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No images provided');
  }
  
  // Upload new images
  const newImages = await Promise.all(
    req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'perfume-marketplace/products'
      });
      return result.secure_url;
    })
  );
  
  product.images = [...product.images, ...newImages];
  await product.save();
  
  res.json({
    message: 'Images added successfully',
    product
  });
});

// @desc    Delete product image
// @route   DELETE /api/user/products/:id/images/:imageIndex
// @access  Private
const deleteProductImage = asyncHandler(async (req, res) => {
  const { id, imageIndex } = req.params;
  
  const product = await Product.findById(id);
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  
  // Check if user owns the product
  if (product.seller.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this product');
  }
  
  const index = parseInt(imageIndex);
  if (index < 0 || index >= product.images.length) {
    res.status(400);
    throw new Error('Invalid image index');
  }
  
  if (product.images.length <= 1) {
    res.status(400);
    throw new Error('Cannot delete the last image');
  }
  
  // Delete image from Cloudinary
  const imageUrl = product.images[index];
  const publicId = imageUrl.split('/').pop().split('.')[0];
  await cloudinary.uploader.destroy(`perfume-marketplace/products/${publicId}`);
  
  // Remove image from array
  product.images.splice(index, 1);
  await product.save();
  
  res.json({
    message: 'Image deleted successfully',
    product
  });
});

export {
  getUserProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getUserProductById,
  getUserDashboardStats,
  updateProductImages,
  deleteProductImage,
};