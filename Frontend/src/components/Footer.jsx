import { FaInstagram, FaFacebookF, FaTwitter, FaPinterest } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto">
      <div className="bg-primary-500/10 backdrop-blur-md border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-playfair font-bold gradient-text mb-4">
                Élégance
              </h3>
              <p className="text-primary-500/80 text-sm">
                Experience luxury in every scent. Crafted for the extraordinary.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-primary-500 mb-4">Shop</h4>
              <ul className="space-y-2">
                <li><a href="/products?category=Men" className="text-primary-500/80 hover:text-primary-300 transition-colors">Men's Collection</a></li>
                <li><a href="/products?category=Women" className="text-primary-500/80 hover:text-primary-300 transition-colors">Women's Collection</a></li>
                <li><a href="/products?category=Unisex" className="text-primary-500/80 hover:text-primary-300 transition-colors">Unisex Scents</a></li>
                <li><a href="/products?isNewArrival=true" className="text-primary-500/80 hover:text-primary-300 transition-colors">New Arrivals</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-primary-500 mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary-500/80 hover:text-primary-300 transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-primary-500/80 hover:text-primary-300 transition-colors">Shipping Info</a></li>
                <li><a href="#" className="text-primary-500/80 hover:text-primary-300 transition-colors">Returns & Exchanges</a></li>
                <li><a href="#" className="text-primary-500/80 hover:text-primary-300 transition-colors">FAQs</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold text-primary-500 mb-4">Stay Connected</h4>
              <p className="text-primary-500/80 text-sm mb-4">
                Subscribe for exclusive offers and new scent launches.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="glass-input w-full px-4 py-2 rounded-lg focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="glass-button w-full py-2 rounded-lg text-white font-medium"
                >
                  Subscribe
                </motion.button>
              </form>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-8 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="text-primary-500 hover:text-primary-300 transition-colors"
              >
                <FaInstagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="text-primary-500 hover:text-primary-300 transition-colors"
              >
                <FaFacebookF className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="text-primary-500 hover:text-primary-300 transition-colors"
              >
                <FaTwitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="text-primary-500 hover:text-primary-300 transition-colors"
              >
                <FaPinterest className="w-5 h-5" />
              </motion.a>
            </div>

            <div className="text-primary-500/60 text-sm">
              © {currentYear} Élégance Perfumes. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer