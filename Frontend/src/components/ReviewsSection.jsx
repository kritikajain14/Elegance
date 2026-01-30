import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiStar, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import ReviewCard from './ReviewCard'
import ReviewForm from './ReviewForm'
import Loader from './Loader'
import { reviewAPI } from '../utils/api'

const ReviewsSection = ({ productId, productRating, reviewCount, onReviewAdded }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [sortBy, setSortBy] = useState('recent')
  const [averageRating, setAverageRating] = useState(productRating || 0)
  const [totalReviews, setTotalReviews] = useState(reviewCount || 0)

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const { data } = await reviewAPI.getProductReviews(productId)
      setReviews(data.reviews || [])
      setAverageRating(data.averageRating || productRating || 0)
      setTotalReviews(data.reviewCount || reviewCount || 0)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }


  // const handleReviewAdded = async (newReview, updatedProduct) => {
  //   // Add the new review to the beginning of the list
  //   setReviews(prevReviews => [newReview, ...prevReviews])

  // // Update average rating and total count
  //   setAverageRating(updatedProduct.rating)
  //   setTotalReviews(updatedProduct.reviewCount)
    
  //   // Notify parent component if needed
  //   if (onReviewAdded) {
  //     onReviewAdded(updatedProduct)
  //   }
    
  //   // Refetch to get all reviews in correct order
  //   setTimeout(() => {
  //     fetchReviews()
  //   }, 500)
  // }

  const handleReviewAdded = async (newReview, updatedProduct) => {
  if (!newReview) {
    console.error("Review missing:", newReview);
    return;
  }

  setReviews(prev => [newReview, ...prev]);

  // if (updatedProduct) {
  //   setAverageRating(updatedProduct.rating ?? 0);
  //   setTotalReviews(updatedProduct.reviewCount);

  //   if (onReviewAdded) {
  //     onReviewAdded(updatedProduct);
  //   }
  // } else {
  //   console.warn("updatedProduct missing, refetching product");
  // }

  // Always refetch to stay consistent with backend
  fetchReviews();
};

  const handleReviewDeleted = (deletedReviewId) => {
    setReviews(prevReviews => prevReviews.filter(review => review._id !== deletedReviewId))
    setTotalReviews(prev => prev - 1)
  }

  const handleFeedbackUpdated = (reviewId, type) => {
    setReviews(prevReviews => prevReviews.map(review => {
      if (review._id === reviewId) {
        return {
          ...review,
          [type === 'helpful' ? 'helpful' : 'notHelpful']: 
            (review[type === 'helpful' ? 'helpful' : 'notHelpful'] || 0) + 1
        }
      }
      return review
    }))
  }

  // Sort reviews
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      case 'helpful':
        return (b.helpful || 0) - (a.helpful || 0)
      case 'recent':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 3)

  // Calculate rating distribution
  const ratingDistribution = Array(5).fill(0).map((_, index) => {
    const star = 5 - index
    const count = reviews.filter(r => r.rating === star).length
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
    return { star, count, percentage }
  })

  if (loading && reviews.length === 0) return <Loader />

  return (
    <section className="py-8">
      <h2 className="text-3xl font-playfair font-bold text-primary-500 mb-8">
        Customer Reviews
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Rating Overview */}
        <div className="md:col-span-1">
          <div className="glass-card rounded-xl p-6 sticky top-32">
            {/* Overall Rating */}
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-primary-500 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-primary-500/70">
                Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-16">
                    <span className="text-primary-500">{star}</span>
                    <FiStar className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="grow">
                    <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-primary-500/70 text-sm w-12">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2">
          {/* Sort Controls */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-primary-500">
              All Reviews ({totalReviews})
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input px-4 py-2 rounded-lg focus:outline-none"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>

          {/* Review Form */}
          <ReviewForm 
            productId={productId} 
            onReviewAdded={handleReviewAdded}
          />

          {/* Reviews List */}
          <AnimatePresence mode="wait">
            {displayedReviews.length > 0 ? (
              <motion.div
                key="reviews-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"

              >
                {displayedReviews.map((review, index) => (
                  <motion.div
                    key={review._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ReviewCard
                      review={review}
                      productId={productId}
                      onReviewDeleted={handleReviewDeleted}
                      onFeedbackUpdated={handleFeedbackUpdated}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-reviews"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card rounded-xl p-8 text-center"
              >
                <h4 className="text-xl font-semibold text-primary-500 mb-2">
                  No Reviews Yet
                </h4>
                <p className="text-primary-500/70">
                  Be the first to share your thoughts about this perfume!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Show More/Less Button */}
          {reviews.length > 3 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAll(!showAll)}
                className="glass-card px-6 py-3 rounded-full text-primary-500 font-medium hover:bg-white/20 transition-colors flex items-center space-x-2 mx-auto"
              >
                <span>{showAll ? 'Show Less' : `Show All Reviews (${reviews.length})`}</span>
                {showAll ? (
                  <FiChevronUp className="w-5 h-5" />
                ) : (
                  <FiChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ReviewsSection