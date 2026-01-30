import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, getCartTotal } = useCart()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-primary-500 mb-4">
          Please login to view your cart
        </h2>
        <p className="text-primary-500/70 mb-8">
          Sign in to see your saved items and checkout
        </p>
        <Link to="/login">
          <button className="glass-button px-8 py-3 rounded-full text-white font-semibold">
            Login to Continue
          </button>
        </Link>
      </div>
    )
  }

  if (loading) return <Loader />

  const cartItems = cart?.items || []

  const handleQuantityChange = async (item, change) => {
    const newQuantity = item.quantity + change
    if (newQuantity >= 1) {
      try {
        await updateQuantity(item.productId._id, newQuantity)
      } catch (error) {
        toast.error('Failed to update quantity')
      }
    }
  }

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId)
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-playfair font-bold text-primary-500 mb-8">
        Your Shopping Cart
      </h1>

      <AnimatePresence>
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-16"
          >
            <FiShoppingBag className="w-24 h-24 text-primary-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-primary-500 mb-4">
              Your cart is empty
            </h3>
            <p className="text-primary-500/70 mb-8 max-w-md mx-auto">
              Add some luxurious perfumes to your cart and come back here to complete your order.
            </p>
            <Link to="/products">
              <button className="glass-button px-8 py-3 rounded-full text-white font-semibold">
                Continue Shopping
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.productId._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="glass-card rounded-xl p-6 mb-4"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <div className="w-32 h-32 rounded-lg overflow-hidden shrink-0">
                        <img
                          src={item.productId.images[0]}
                          alt={item.productId.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="grow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-primary-500 text-lg">
                              {item.productId.name}
                            </h3>
                            <p className="text-primary-500/60 text-sm">
                              {item.productId.size}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemove(item.productId._id)}
                            className="text-primary-500/60 hover:text-red-500 transition-colors p-2"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <p className="text-primary-500/70 text-sm mb-4 line-clamp-2">
                          {item.productId.description}
                        </p>

                        <div className="flex justify-between items-center">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-4">
                            <div className="glass-card rounded-full px-4 py-2 flex items-center space-x-4">
                              <button
                                onClick={() => handleQuantityChange(item, -1)}
                                className="text-primary-500 hover:text-primary-300"
                                disabled={item.quantity <= 1}
                              >
                                <FiMinus className="w-4 h-4" />
                              </button>
                              <span className="font-medium text-primary-500 min-w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item, 1)}
                                className="text-primary-500 hover:text-primary-300"
                              >
                                <FiPlus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary-500">
                              ${(item.productId.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-sm text-primary-500/60">
                              ${item.productId.price} each
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-xl p-6 sticky top-32">
                <h3 className="font-bold text-primary-500 text-xl mb-6">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-primary-500/70">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-primary-500/70">
                    <span>Shipping</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  <div className="flex justify-between text-primary-500/70">
                    <span>Tax</span>
                    <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between font-bold text-primary-500 text-xl">
                      <span>Total</span>
                      <span>${(getCartTotal() * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
  <Link to="/products">
    <button className="w-full glass-card py-3 rounded-lg text-primary-500 font-medium hover:bg-white/20 transition-colors">
      Continue Shopping
    </button>
  </Link>
  <Link to="/checkout">
    <button className="w-full glass-button py-3 rounded-lg text-white font-semibold text-lg">
      Proceed to Checkout
    </button>
  </Link>
</div>

                {/* Promo Code */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-primary-500/70 text-sm mb-3">
                    Have a promo code?
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="grow glass-input px-4 py-2 rounded-lg focus:outline-none"
                    />
                    <button className="glass-card px-4 py-2 rounded-lg text-primary-500 font-medium hover:bg-white/20 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Cart