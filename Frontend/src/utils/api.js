import axios from 'axios'
import toast from 'react-hot-toast'

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred'
    
    // Don't show toast for 401 errors on login/register
    if (error.response?.status !== 401 || 
        !error.config.url.includes('/auth/')) {
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

const reviewAPI = {
  // Get product reviews
  getProductReviews: (productId) => API.get(`/products/${productId}/reviews`),
  
  // Add review
  addReview: (productId, reviewData) => API.post(`/products/${productId}/reviews`, reviewData),
  
  // Mark review helpful
  markHelpful: (productId, reviewId, isHelpful) => 
    API.put(`/products/${productId}/reviews/${reviewId}/helpful`, { isHelpful }),
  
  // Delete review
  deleteReview: (productId, reviewId) => 
    API.delete(`/products/${productId}/reviews/${reviewId}`)
};

export { reviewAPI };

export default API