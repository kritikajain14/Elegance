import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiShare2, 
  FiFacebook, 
  FiTwitter, 
  FiLink, 
  FiMail,
  FiMessageCircle,
  FiChevronUp
} from 'react-icons/fi'
import toast from 'react-hot-toast'

const FloatingShareBar = ({ product }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const productName = product?.name || 'Amazing Perfume'
  const productPrice = product?.price ? `$${product.price}` : ''

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset
      setScrollPosition(position)
      setIsVisible(position > 300) // Show after scrolling 300px
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const shareActions = {
    facebook: () => {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
      window.open(url, '_blank')
      toast.success('Shared on Facebook!')
    },
    twitter: () => {
      const text = `Check out "${productName}" from Élégance Perfumes! ${productPrice ? `Only ${productPrice}` : ''}`
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`
      window.open(url, '_blank')
      toast.success('Shared on Twitter!')
    },
    whatsapp: () => {
      const text = `Check out "${productName}" from Élégance Perfumes! ${productPrice ? `Only ${productPrice}` : ''} - ${currentUrl}`
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`
      window.open(url, '_blank')
      toast.success('Shared on WhatsApp!')
    },
    email: () => {
      const subject = `Check out "${productName}" from Élégance Perfumes`
      const body = `Hi there!\n\nI found this amazing perfume that I think you'll love!\n\n${productName}\n${productPrice ? `Price: ${productPrice}` : ''}\n\nCheck it out here: ${currentUrl}`
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    },
    copyLink: async () => {
      try {
        await navigator.clipboard.writeText(currentUrl)
        toast.success('Link copied to clipboard!')
      } catch (err) {
        toast.error('Failed to copy link')
      }
    }
  }

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="relative">
        {/* Floating Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="glass-button p-4 rounded-full shadow-2xl flex items-center justify-center mb-3"
        >
          {isExpanded ? (
            <FiChevronUp className="w-6 h-6 text-white" />
          ) : (
            <FiShare2 className="w-6 h-6 text-white" />
          )}
        </motion.button>

        {/* Share Options */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-full right-0 mb-3"
          >
            <div className="glass-card rounded-2xl p-3 shadow-2xl">
              <div className="flex flex-col space-y-3">
                {/* Facebook */}
                <motion.button
                  whileHover={{ x: -5 }}
                  onClick={shareActions.facebook}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <FiFacebook className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-primary-500 font-medium group-hover:text-blue-600">
                    Facebook
                  </span>
                </motion.button>

                {/* Twitter */}
                <motion.button
                  whileHover={{ x: -5 }}
                  onClick={shareActions.twitter}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-sky-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center">
                    <FiTwitter className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-primary-500 font-medium group-hover:text-sky-600">
                    Twitter
                  </span>
                </motion.button>

                {/* WhatsApp */}
                <motion.button
                  whileHover={{ x: -5 }}
                  onClick={shareActions.whatsapp}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-green-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <FiMessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-primary-500 font-medium group-hover:text-green-600">
                    WhatsApp
                  </span>
                </motion.button>

                {/* Email */}
                <motion.button
                  whileHover={{ x: -5 }}
                  onClick={shareActions.email}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                    <FiMail className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-primary-500 font-medium group-hover:text-gray-600">
                    Email
                  </span>
                </motion.button>

                {/* Copy Link */}
                <motion.button
                  whileHover={{ x: -5 }}
                  onClick={shareActions.copyLink}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-primary-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-primary-200 rounded-lg flex items-center justify-center">
                    <FiLink className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-primary-500 font-medium group-hover:text-primary-300">
                    Copy Link
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default FloatingShareBar