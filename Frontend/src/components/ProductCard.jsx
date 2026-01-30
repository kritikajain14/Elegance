import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import toast from 'react-hot-toast'
import ShareButton from './ShareButton'
import { useState, useEffect } from 'react'


const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)


    useEffect(() => {
    setIsWishlisted(isInWishlist(product._id))
  }, [product._id, isInWishlist])



  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await addToCart(product._id, 1)
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const handleWishlistToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      setIsWishlistLoading(true)
      const result = await toggleWishlist(product._id)
      if (result.success) {
        setIsWishlisted(!isWishlisted)
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    } finally {
      setIsWishlistLoading(false)
    }
  }

  const discount = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleShare = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Share functionality will be handled by ShareButton
  }


  return (
    <Link to={`/products/${product._id}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="card-3d glass-card rounded-xl p-4 hover:soft-glow transition-all duration-300 h-95 sm:h-100 lg:h-105flex flex-col"
      >

        {/* Share Button */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ShareButton product={product} position="bottom" />
        </div>
        
        {/* Badges */}
        <div className="flex justify-between items-start mb-3">

          {product.isNewArrival && (
            <span className="bg-primary-200 text-white text-xs px-3 py-1 rounded-full">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Image */}
        <div className="relative overflow-hidden rounded-lg mb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
          />
          <button 
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-primary-100 hover:text-white transition-colors"
          >
            <FiShoppingCart className="w-5 h-5" />
          </button>

          {/* Wishlist Button */}
          <button 
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
              isWishlisted 
                ? 'bg-red-500/90 text-white shadow-lg' 
                : 'bg-white/80 text-primary-500 hover:bg-white hover:text-red-500'
            } ${isWishlistLoading ? 'opacity-50' : ''}`}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <motion.div
              animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </motion.div>
          </button>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-primary-100 hover:text-white transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <FiShoppingCart className="w-5 h-5" />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-1">

          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-primary-500 line-clamp-1 min-h-6 sm:min-h-6.5">
                {product.name}
              </h3>
              <p className="text-sm text-primary-500/70">{product.size}</p>
            </div>
            <button className="text-primary-500/70 hover:text-primary-300 p-1">
              <FiHeart className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-primary-500/60 line-clamp-2 mb-3 min-h-9 sm:min-h-10">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between mt-auto ">
            <div>
              {discount > 0 && (
                <span className="text-sm text-primary-500/50 line-through mr-2">
                  ${product.originalPrice}
                </span>
              )}
              <span className="text-xl font-bold text-primary-500">
                ${product.price}
              </span>
            </div>
{/* Rating */}
<div className="flex items-center gap-1 shrink-0 max-w-full">
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`text-xs sm:text-sm ${
          i < Math.floor(product.rating)
            ? 'text-yellow-400'
            : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ))}
  </div>
</div>

          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default ProductCard