import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiHeart,
  FiX,
} from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { motion } from 'framer-motion'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { user, logout } = useAuth()
  const { getCartCount } = useCart()
  const { getWishlistCount } = useWishlist()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Shop' },
    
    { path: '/dashboard', label: 'Sell' },
    { path: '/products?category=Men', label: 'Men' },
    { path: '/products?category=Women', label: 'Women' },
    { path: '/products?category=Unisex', label: 'Unisex' },
  ]

  return (
    <nav className="glass-navbar z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-3xl font-playfair font-bold gradient-text"
            >
              Élégance
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-primary-500 hover:text-primary-300 font-medium transition-colors duration-300 ${
                    isActive
                      ? 'text-primary-300 border-b-2 border-primary-300'
                      : ''
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Wishlist Link (Desktop) */}
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `text-primary-500 hover:text-primary-300 font-medium transition-colors duration-300 flex items-center space-x-1 ${
                  isActive
                    ? 'text-primary-300 border-b-2 border-primary-300'
                    : ''
                }`
              }
            >
              <FiHeart className="w-4 h-4" />
              <span>Wishlist</span>
            </NavLink>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-6">
            {/* Wishlist Icon */}
            <Link to="/wishlist" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-primary-500 hover:text-primary-300 transition-colors"
              >
                <FiHeart className="w-6 h-6" />
                {getWishlistCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getWishlistCount()}
                  </span>
                )}
              </motion.div>
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-primary-500 hover:text-primary-300 transition-colors"
              >
                <FiShoppingCart className="w-6 h-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-200 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </motion.div>
            </Link>

            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-primary-500">Hi, {user.name}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="glass-button px-4 py-2 rounded-full text-white font-medium"
                >
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-primary-500 hover:text-primary-300 font-medium transition-colors"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-button px-6 py-2 rounded-full text-white font-medium"
                  >
                    Register
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-primary-500 hover:text-primary-300"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass-card rounded-lg p-4 mt-2"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-primary-500 hover:text-primary-300 py-2 ${
                      isActive
                        ? 'text-primary-300 border-l-4 border-primary-300 pl-2'
                        : ''
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {/* Wishlist (Mobile) */}
              <NavLink
                to="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-primary-500 hover:text-primary-300 py-2 flex items-center space-x-2 ${
                    isActive
                      ? 'text-primary-300 border-l-4 border-primary-300 pl-2'
                      : ''
                  }`
                }
              >
                <FiHeart className="w-4 h-4" />
                <span>Wishlist</span>
              </NavLink>

              <div className="pt-4 border-t border-white/20">
                {user ? (
                  <>
                    <div className="text-primary-500 py-2">
                      Hi, {user.name}
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="glass-button w-full py-2 rounded-lg text-white font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <button className="w-full py-2 text-primary-500 hover:text-primary-300">
                        Login
                      </button>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <button className="glass-button w-full py-2 rounded-lg text-white font-medium mt-2">
                        Register
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
