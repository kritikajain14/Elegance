import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  helpful: {
    type: Number,
    default: 0
  },
  notHelpful: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  longDescription: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    enum: ['Men', 'Women', 'Unisex'],
    required: true
  },
  size: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  images: [{
    type: String,
    required: true
  }],
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },

    // New fields for user products
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  sellerName: {
    type: String,
    required: false,
    default: ''
  },
  sellerRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  sellerReviewCount: {
    type: Number,
    default: 0
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair'],
    default: 'New'
  },
  brand: {
    type: String,
    trim: true
  },
  notes: {
    type: [String],
    default: []
  },
  concentration: {
    type: String,
    enum: ['Eau de Parfum', 'Eau de Toilette', 'Eau de Cologne', 'Parfum', 'Extrait'],
    default: 'Eau de Parfum'
  },
  releaseYear: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear()
  },
  isApproved: {
    type: Boolean,
    default: false // Admin approval for marketplace products
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'sold'],
    default: 'pending'
  },
  views: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
}, {
  timestamps: true
});


// Update product rating when reviews change
productSchema.pre('save', async function () {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );

    this.rating = totalRating / this.reviews.length;
    this.reviewCount = this.reviews.length;
  }
});


// Index for better performance
productSchema.index({ seller: 1, status: 1 });
productSchema.index({ isApproved: 1, status: 1 });
productSchema.index({ category: 1, isApproved: 1 });


const Product = mongoose.model('Product', productSchema);

export default Product;