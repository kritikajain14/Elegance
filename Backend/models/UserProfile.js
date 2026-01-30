import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  
  location: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  socialLinks: {
    instagram: String,
    twitter: String,
    facebook: String
  },
  sellerRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },
  totalProducts: {
    type: Number,
    default: 0
  },
  joinedDate: {
    type: Date,
    default: Date.now
  },
  isVerifiedSeller: {
    type: Boolean,
    default: false
  },
  shippingPolicy: {
    type: String,
    default: 'Standard shipping within 2-3 business days'
  },
  returnPolicy: {
    type: String,
    default: '30-day return policy'
  },
  // Store preferences
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      newMessages: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true }
    }
  },
  // Bank/Stripe account for payouts
  stripeAccountId: {
    type: String
  },
  payoutEnabled: {
    type: Boolean,
    default: false
  },
  balance: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile;