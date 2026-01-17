import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Update product rating when a review is added
reviewSchema.post('save', async function() {
  const Review = this.constructor
  const Product = mongoose.model('Product')
  
  const reviews = await Review.find({ product: this.product })
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalRating / reviews.length
  
  await Product.findByIdAndUpdate(this.product, {
    rating: averageRating,
    reviewCount: reviews.length
  })
})

const Review = mongoose.model('Review', reviewSchema)

export default Review