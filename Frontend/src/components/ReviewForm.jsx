import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiSend } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { reviewAPI } from '../utils/api'
import toast from 'react-hot-toast'

const ReviewForm = ({ productId, onReviewAdded }) => {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please login to submit a review')
      return
    }
    
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }
    
    if (comment.trim().length < 10) {
      toast.error('Please write a more detailed review (minimum 10 characters)')
      return
    }
    
    try {
      setIsSubmitting(true)
      const response = await reviewAPI.addReview(productId, {
        rating,
        comment: comment.trim()
      })
      
      const { review, product } = response.data
      
      // Add user object to review for consistency
      const reviewWithUser = {
        ...review,
        user: {
          _id: user._id,
          name: user.name
        }
      }
      
      toast.success('Review submitted successfully!')
      
      // Reset form
      setRating(0)
      setComment('')
      
      // Notify parent component
      onReviewAdded(reviewWithUser, product)
    } catch (error) {
      console.error('Review submission error:', error)
      toast.error(error.response?.data?.message || 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="glass-card rounded-xl p-6 mb-8">
        <p className="text-primary-500/80">
          Please <a href="/login" className="text-primary-300 hover:underline">login</a> to submit a review
        </p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6 mb-8">
      <h3 className="text-xl font-semibold text-primary-500 mb-4">
        Write a Review
      </h3>
      
      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="mb-6">
          <label className="block text-primary-500/70 mb-3">
            How would you rate this product?
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <FiStar
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-primary-500/60 mt-2">
            Selected: {rating} out of 5 stars
          </p>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-primary-500/70 mb-3">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this perfume. What did you like or dislike?"
            className="glass-input w-full px-4 py-3 rounded-lg focus:outline-none min-h-30"
            maxLength={500}
          />
          <div className="flex justify-between mt-2">
            <span className="text-sm text-primary-500/60">
              Minimum 10 characters
            </span>
            <span className="text-sm text-primary-500/60">
              {comment.length}/500
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
          className={`glass-button w-full py-3 rounded-lg text-white font-semibold flex items-center justify-center space-x-2 ${
            (rating === 0 || comment.trim().length < 10 || isSubmitting)
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          <FiSend className="w-5 h-5" />
          <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
        </motion.button>
      </form>
    </div>
  )
}

export default ReviewForm