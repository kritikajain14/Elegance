import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowRight, FiPackage } from 'react-icons/fi'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const Wishlist = () => {
  const navigate = useNavigate()
  const { wishlist, loading, clearWishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [isClearing, setIsClearing] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view your wishlist')
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  const handleClearWishlist = async () => {
    if (!window.confirm('Are you sure you want to clear your wishlist?')) return
    
    try {
      setIsClearing(true)
      await clearWishlist()
    } catch (error) {
      toast.error('Failed to clear wishlist')
    } finally {
      setIsClearing(false)
    }
  }

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromWishlist(productId)
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const handleAddAllToCart = async () => {
    if (wishlist.items.length === 0) return
    
    try {
      const promises = wishlist.items.map(item => 
        addToCart(item.productId._id, 1)
      )
      
      await Promise.all(promises)
      toast.success(`Added ${wishlist.items.length} items to cart!`)
    } catch (error) {
      toast.error('Failed to add some items to cart')
    }
  }

  const handleMoveToCart = async (productId) => {
    try {
      await addToCart(productId, 1)
      await removeFromWishlist(productId)
      toast.success('Moved to cart!')
    } catch (error) {
      toast.error('Failed to move to cart')
    }
  }

  if (loading) return <Loader />

  const wishlistItems = wishlist?.items || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-playfair font-bold text-primary-500 mb-2">
              My Wishlist
            </h1>
            <p className="text-primary-500/70">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          
          {wishlistItems.length > 0 && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddAllToCart}
                className="glass-button px-6 py-3 rounded-full text-white font-medium flex items-center space-x-2"
              >
                <FiShoppingBag className="w-5 h-5" />
                <span>Add All to Cart</span>
              </button>
              
              <button
                onClick={handleClearWishlist}
                disabled={isClearing}
                className="glass-card px-6 py-3 rounded-full text-primary-500 font-medium hover:bg-white/20 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <FiTrash2 className="w-5 h-5" />
                <span>{isClearing ? 'Clearing...' : 'Clear All'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {wishlistItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-16"
          >
            <div className="inline-block p-8 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-linear-to-br from-primary-50 to-primary-100 flex items-center justify-center mx-auto">
                  <FiHeart className="w-16 h-16 text-primary-300" />
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                  <FiPackage className="w-6 h-6 text-primary-500" />
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-semibold text-primary-500 mb-4">
              Your wishlist is empty
            </h3>
            <p className="text-primary-500/70 mb-8 max-w-md mx-auto">
              Save your favorite perfumes here to keep track of what you love.
              Click the heart icon on any product to add it to your wishlist.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <button className="glass-button px-8 py-3 rounded-full text-white font-semibold flex items-center space-x-2">
                  <FiShoppingBag className="w-5 h-5" />
                  <span>Browse Perfumes</span>
                </button>
              </Link>
              
              <Link to="/products?isNewArrival=true">
                <button className="glass-card px-8 py-3 rounded-full text-primary-500 font-medium hover:bg-white/20 transition-colors flex items-center space-x-2">
                  <span>View New Arrivals</span>
                  <FiArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div>
            {/* Wishlist Stats */}
            <div className="glass-card rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500 mb-2">
                    {wishlistItems.length}
                  </div>
                  <p className="text-primary-500/70">Items Saved</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500 mb-2">
                    ${wishlistItems.reduce((total, item) => total + (item.productId?.price || 0), 0).toFixed(2)}
                  </div>
                  <p className="text-primary-500/70">Total Value</p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500 mb-2">
                    {wishlistItems.filter(item => item.productId?.isNewArrival).length}
                  </div>
                  <p className="text-primary-500/70">New Arrivals</p>
                </div>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {wishlistItems.map((item, index) => (
                  <motion.div
                    key={item.productId?._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    layout
                  >
                    <div className="relative">
                      {/* Product Card */}
                      <ProductCard product={item.productId} />
                      
                      {/* Quick Actions Overlay */}
                      <div className="absolute inset-0 bg-linear-to-t from-primary-500/90 to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleMoveToCart(item.productId._id)}
                              className="flex-1 glass-button py-2 rounded-lg text-white font-medium text-sm flex items-center justify-center space-x-2"
                            >
                              <FiShoppingBag className="w-4 h-4" />
                              <span>Add to Cart</span>
                            </button>
                            
                            <button
                              onClick={() => handleRemoveItem(item.productId._id)}
                              className="glass-card p-2 rounded-lg text-primary-500 hover:bg-white/20 transition-colors"
                              title="Remove from wishlist"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Wishlist Actions Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12"
            >
              <div className="glass-card rounded-xl p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-semibold text-primary-500 mb-2">
                      Ready to make them yours?
                    </h3>
                    <p className="text-primary-500/70">
                      Turn your wishlist into reality. Add all items to cart for a seamless checkout.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={handleAddAllToCart}
                      className="glass-button px-8 py-3 rounded-full text-white font-semibold flex items-center space-x-2"
                    >
                      <FiShoppingBag className="w-5 h-5" />
                      <span>Add All to Cart</span>
                    </button>
                    
                    <Link to="/products">
                      <button className="glass-card px-8 py-3 rounded-full text-primary-500 font-medium hover:bg-white/20 transition-colors flex items-center space-x-2">
                        <span>Continue Shopping</span>
                        <FiArrowRight className="w-5 h-5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Wishlist