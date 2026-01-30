import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [wishlistItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure each product appears only once in wishlist
wishlistSchema.path('items').validate(function(value) {
  const productIds = value.map(item => item.productId.toString());
  return new Set(productIds).size === productIds.length;
}, 'Product already exists in wishlist');

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;