import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiArrowLeft, FiStar, FiUsers, FiShare2, FiCopy } from 'react-icons/fi'
import API from '../utils/api'
import ReviewsSection from '../components/ReviewsSection'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext';
import Loader from '../components/Loader'
import ShareButton from '../components/ShareButton'
import FloatingShareBar from '../components/FloatingShareBar'
import toast from 'react-hot-toast'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  useEffect(() => {
    fetchProduct()
  }, [id])

  useEffect(() => {
  setIsWishlisted(isInWishlist(product?._id));
}, [product?._id, isInWishlist]);

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const { data } = await API.get(`/products/${id}`)
      setProduct(data)

    } catch (error) {
      console.error('Error fetching product:', error)
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity)
      toast.success('Added to cart!')
    } catch (error) {
      if (!isAuthenticated) {
        toast.error('Please login to add items to cart')
        navigate('/login')
      }
    }
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity)
    }
  }

  const handleReviewAdded = (updatedProduct) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      rating: updatedProduct.rating,
      reviewCount: updatedProduct.reviewCount
    }))
  }

  const copyProductLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Product link copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const shareViaWhatsApp = () => {
    const text = `Check out "${product.name}" from Élégance Perfumes! Only $${product.price} - ${window.location.href}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }


  if (loading) return <Loader />
  if (!product) return null

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0


const handleWishlistToggle = async () => {
  try {
    setIsWishlistLoading(true);
    const result = await toggleWishlist(product._id);
    if (result.success) {
      setIsWishlisted(!isWishlisted);
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
  } finally {
    setIsWishlistLoading(false);
  }
};


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-primary-500 hover:text-primary-300 mb-8 transition-colors"
      >
        <FiArrowLeft />
        <span>Back to Shop</span>
      </button>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div>
          <div className="glass-card rounded-2xl overflow-hidden mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-96 sm:h-80 md:h-125 object-cover rounded-2xl"
            />

            {/* Share Button on Image */}
            <div className="absolute top-4 right-4">
              <ShareButton product={product} position="bottom" />
            </div>

          </div>




          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`glass-card rounded-lg overflow-hidden ${selectedImage === index ? 'ring-2 ring-primary-300' : ''
                    }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Badges */}
          <div className="flex gap-2 mb-4">
            {product.isNewArrival && (
              <span className="bg-primary-200 text-white px-3 py-1 rounded-full text-sm">
                New Arrival
              </span>
            )}
            {product.isPopular && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                Popular
              </span>
            )}
            {discount > 0 && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                -{discount}% OFF
              </span>
            )}
          </div>

            {/* Quick Share Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={copyProductLink}
                  className="glass-card p-2 rounded-lg hover:bg-white/20 transition-colors"
                  title="Copy link"
                >
                  <FiCopy className="w-5 h-5 text-primary-500" />
                </button>
                <button
                  onClick={shareViaWhatsApp}
                  className="glass-card p-2 rounded-lg hover:bg-white/20 transition-colors"
                  title="Share on WhatsApp"
                >
                  <FiShare2 className="w-5 h-5 text-primary-500" />
                </button>
              </div>

          <h1 className="text-4xl font-playfair font-bold text-primary-500 mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                    }`}
                />
              ))}
            </div>
            <div className="flex items-center space-x-4 mb-6">

              <div className="flex items-center space-x-2 text-primary-500/70">
                <FiUsers className="w-4 h-4" />
                <span>{product.reviewCount || 0} reviews</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="text-primary-500/80 leading-relaxed">
              {product.longDescription}
            </p>
          </div>

          {/* Details */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-primary-500/60 text-sm">Category</span>
                <p className="font-medium text-primary-500">{product.category}</p>
              </div>
              <div>
                <span className="text-primary-500/60 text-sm">Size</span>
                <p className="font-medium text-primary-500">{product.size}</p>
              </div>
              <div>
                <span className="text-primary-500/60 text-sm">Stock</span>
                <p className={`font-medium text-xs sm:text-sm leading-tight min-h-4.5 sm:min-h-5 line-clamp-1 ${product.stock > 5 ? 'text-green-500' : 'text-red-500'
                  }`}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mb-8">
            {discount > 0 && (
              <div className="text-sm text-primary-500/50 line-through mb-1">
                ${product.originalPrice}
              </div>
            )}
            <div className="text-5xl font-bold text-primary-500 mb-2">
              ${product.price}
            </div>
            <div className="text-primary-500/70">
              Free shipping on orders over $100
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="glass-card rounded-full px-4 py-2 flex items-center justify-between w-32">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="text-primary-500 hover:text-primary-300 text-xl"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="text-xl font-semibold text-primary-500">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="text-primary-500 hover:text-primary-300 text-xl"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 glass-button rounded-full py-4 text-white font-semibold text-lg flex items-center justify-center space-x-2 ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              <FiShoppingCart className="w-6 h-6" />
              <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
            </motion.button>

            <button 
  onClick={handleWishlistToggle}
  disabled={isWishlistLoading}
  className={`glass-card p-4 rounded-full hover:bg-primary-50 transition-all duration-300 ${
    isWishlisted ? 'bg-red-50 text-red-500' : ''
  } ${isWishlistLoading ? 'opacity-50' : ''}`}
  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
>
  <motion.div
    animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}
    transition={{ duration: 0.3 }}
  >
    <FiHeart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
  </motion.div>
</button>
          </div>

          {/* Stock Warning */}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="mt-4 text-sm text-red-500">
              ⚠️ Only {product.stock} left in stock!
            </div>
          )}

          <ReviewsSection
            productId={product._id}
            productRating={product.rating}
            reviewCount={product.reviewCount || 0}
            onReviewAdded={handleReviewAdded}
          />

        </div>
        {/* Floating Share Bar */}
      <FloatingShareBar product={product} />
      </div>
    </div>
  )
}

export default ProductDetails