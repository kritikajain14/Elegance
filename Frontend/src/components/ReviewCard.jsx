import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiThumbsUp, FiThumbsDown, FiTrash2, FiStar, FiCheck } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { reviewAPI } from '../utils/api'
import { formatDistanceToNow } from 'date-fns'

const ReviewCard = ({ review, productId, onReviewDeleted, onFeedbackUpdated }) => {
  const { user } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isHelpfulLoading, setIsHelpfulLoading] = useState(false)
  const [isNotHelpfulLoading, setIsNotHelpfulLoading] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const isOwnReview = user && review.user && (
    review.user._id === user._id || 
    (typeof review.user === 'string' && review.user === user._id)
  )

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) return
    
    try {
      setIsDeleting(true)
      await reviewAPI.deleteReview(productId, review._id)
      toast.success('Review deleted successfully')
      onReviewDeleted(review._id)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete review')
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleHelpful = async () => {
    if (!user) {
      toast.error('Please login to vote')
      return
    }

    if (hasVoted) {
      toast.error('You have already voted on this review')
      return
    }

    try {
      setIsHelpfulLoading(true)
      await reviewAPI.markHelpful(productId, review._id, true)
      toast.success('Thanks for your feedback!')
      setHasVoted(true)
      onFeedbackUpdated(review._id, 'helpful')
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to vote')
      } else {
        toast.error('Failed to submit feedback')
      }
    } finally {
      setIsHelpfulLoading(false)
    }
  }

  const handleNotHelpful = async () => {
    if (!user) {
      toast.error('Please login to vote')
      return
    }

    if (hasVoted) {
      toast.error('You have already voted on this review')
      return
    }

    try {
      setIsNotHelpfulLoading(true)
      await reviewAPI.markHelpful(productId, review._id, false)
      toast.success('Thanks for your feedback!')
      setHasVoted(true)
      onFeedbackUpdated(review._id, 'notHelpful')
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to vote')
      } else {
        toast.error('Failed to submit feedback')
      }
    } finally {
      setIsNotHelpfulLoading(false)
    }
  }

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Recently'
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Recently'
    }
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (review.userName) {
      return review.userName.charAt(0).toUpperCase()
    }
    if (review.user && review.user.name) {
      return review.user.name.charAt(0).toUpperCase()
    }
    return 'U'
  }

  // Get display name
  const getDisplayName = () => {
    if (review.userName) return review.userName
    if (review.user && review.user.name) return review.user.name
    return 'Anonymous User'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card rounded-xl p-6 mb-4 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-4">
          {/* User Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-500 font-semibold text-lg shadow-md">
              {getUserInitials()}
            </div>
            {isOwnReview && (
              <div className="absolute -top-1 -right-1 bg-primary-300 text-white rounded-full p-1">
                <FiCheck className="w-3 h-3" />
              </div>
            )}
          </div>
          
          {/* User Info & Rating */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-primary-500">
                {getDisplayName()}
              </h4>
              {isOwnReview && (
                <span className="text-xs bg-primary-100 text-primary-500 px-2 py-1 rounded-full">
                  You
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <span className="text-sm text-primary-500/60">
                {formatDate(review.createdAt)}
              </span>
              
              {/* Verified Purchase Badge */}
              {review.isVerifiedPurchase && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full flex items-center space-x-1">
                  <FiCheck className="w-3 h-3" />
                  <span>Verified Purchase</span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Delete Button (only for own reviews) */}
        {isOwnReview && (
          <div className="relative">
            {showDeleteConfirm ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1 glass-card text-primary-500 text-sm rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-primary-500/60 hover:text-red-500 transition-colors p-2"
                title="Delete review"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Review Comment */}
      <p className="text-primary-500/80 mb-4 leading-relaxed whitespace-pre-wrap">
        {review.comment}
      </p>
      
      {/* Helpful Feedback Section */}
      <div className="pt-4 border-t border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-primary-500/60">
              Was this review helpful?
            </span>
            
            {/* Helpful Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHelpful}
              disabled={isHelpfulLoading || hasVoted || isOwnReview}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                isOwnReview
                  ? 'opacity-50 cursor-not-allowed'
                  : hasVoted
                  ? 'bg-green-50 text-green-600'
                  : 'glass-card text-primary-500/70 hover:text-green-500 hover:bg-green-50'
              }`}
            >
              <FiThumbsUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                Helpful ({review.helpful || 0})
              </span>
            </motion.button>
            
            {/* Not Helpful Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNotHelpful}
              disabled={isNotHelpfulLoading || hasVoted || isOwnReview}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                isOwnReview
                  ? 'opacity-50 cursor-not-allowed'
                  : hasVoted
                  ? 'bg-red-50 text-red-600'
                  : 'glass-card text-primary-500/70 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <FiThumbsDown className="w-4 h-4" />
              <span className="text-sm font-medium">
                Not Helpful ({review.notHelpful || 0})
              </span>
            </motion.button>
          </div>
          
          {/* Helpfulness Ratio */}
          <div className="hidden sm:block">
            <div className="text-xs text-primary-500/60">
              {review.helpful > 0 || review.notHelpful > 0 ? (
                <>
                  <span className="font-medium text-green-500">
                    {review.helpful || 0}
                  </span>
                  {' / '}
                  <span className="font-medium text-red-500">
                    {review.notHelpful || 0}
                  </span>
                  {' found this helpful'}
                </>
              ) : (
                'No votes yet'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Attributes (if available) */}
      {review.attributes && Object.keys(review.attributes).length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <h5 className="text-sm font-medium text-primary-500/70 mb-2">
            Product Experience
          </h5>
          <div className="flex flex-wrap gap-2">
            {Object.entries(review.attributes).map(([key, value]) => (
              <span
                key={key}
                className="text-xs glass-card px-3 py-1 rounded-full text-primary-500/70"
              >
                {key}: {value}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default ReviewCard