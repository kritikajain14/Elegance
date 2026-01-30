import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi'

const EmptyWishlist = () => {
  return (
    <div className="text-center py-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="inline-block p-8 mb-6"
      >
        <div className="relative">
          <div className="w-40 h-40 rounded-full bg-linear-to-br from-primary-50 to-primary-100 flex items-center justify-center mx-auto">
            <FiHeart className="w-20 h-20 text-primary-300" />
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
          >
            <FiStar className="w-6 h-6 text-yellow-400" />
          </motion.div>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
          >
            <FiShoppingBag className="w-6 h-6 text-primary-500" />
          </motion.div>
        </div>
      </motion.div>
      
      <h3 className="text-3xl font-playfair font-bold text-primary-500 mb-4">
        Your Wishlist Awaits
      </h3>
      <p className="text-primary-500/70 mb-8 max-w-lg mx-auto text-lg">
        Start building your collection of favorite perfumes. 
        Click the heart icon on any product to save it here for later.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/products">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button px-8 py-3 rounded-full text-white font-semibold text-lg flex items-center space-x-2"
          >
            <FiShoppingBag className="w-6 h-6" />
            <span>Explore Collection</span>
          </motion.button>
        </Link>
        
        <Link to="/products?isPopular=true">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-card px-8 py-3 rounded-full text-primary-500 font-medium text-lg hover:bg-white/20 transition-colors"
          >
            View Popular Scents
          </motion.button>
        </Link>
      </div>
      
      {/* Tips */}
      <div className="mt-12">
        <h4 className="font-semibold text-primary-500 mb-4">How to use your wishlist:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="glass-card rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mb-3 mx-auto">
              <span className="text-primary-500 font-bold">1</span>
            </div>
            <p className="text-sm text-primary-500/70">
              Click the heart icon on any product
            </p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mb-3 mx-auto">
              <span className="text-primary-500 font-bold">2</span>
            </div>
            <p className="text-sm text-primary-500/70">
              View all saved items here
            </p>
          </div>
          <div className="glass-card rounded-xl p-4">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mb-3 mx-auto">
              <span className="text-primary-500 font-bold">3</span>
            </div>
            <p className="text-sm text-primary-500/70">
              Add to cart when ready to purchase
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyWishlist