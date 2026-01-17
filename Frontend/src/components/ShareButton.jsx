import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiShare2, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLink, 
  FiMail,
  FiX,
  FiMessageCircle
} from 'react-icons/fi'
import toast from 'react-hot-toast'

const ShareButton = ({ product, position = "bottom" }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  // Get current URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  
  // Product information for sharing
  const productName = product?.name || 'Amazing Perfume'
  const productDescription = product?.description || 'Check out this amazing perfume!'
  const productImage = product?.images?.[0] || ''
  const productPrice = product?.price ? `$${product.price}` : ''
  
  // Share on Facebook
  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
    toast.success('Shared on Facebook!')
    setIsOpen(false)
  }
  
  // Share on Twitter
  const shareOnTwitter = () => {
    const text = `Check out "${productName}" from Élégance Perfumes! ${productPrice ? `Only ${productPrice}` : ''}`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`
    window.open(url, '_blank', 'width=600,height=400')
    toast.success('Shared on Twitter!')
    setIsOpen(false)
  }
  
  // Share on Instagram (Note: Instagram doesn't allow direct sharing via web)
  const shareOnInstagram = () => {
    toast('To share on Instagram, copy the product link and paste it in your Instagram story or post.', {
      duration: 4000,
      icon: '📱',
      style: {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        color: '#2B0013',
        border: '1px solid rgba(255, 148, 178, 0.3)',
      },
    })
    setIsOpen(false)
  }
  
  // Share on Pinterest
  const shareOnPinterest = () => {
    const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(productImage)}&description=${encodeURIComponent(productDescription)}`
    window.open(url, '_blank', 'width=600,height=400')
    toast.success('Shared on Pinterest!')
    setIsOpen(false)
  }
  
  // Share on WhatsApp
  const shareOnWhatsApp = () => {
    const text = `Check out "${productName}" from Élégance Perfumes! ${productPrice ? `Only ${productPrice}` : ''} - ${currentUrl}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'width=600,height=400')
    toast.success('Shared on WhatsApp!')
    setIsOpen(false)
  }
  
  // Share via Email
  const shareViaEmail = () => {
    const subject = `Check out "${productName}" from Élégance Perfumes`
    const body = `Hi there!

I found this amazing perfume that I think you'll love!

${productName}
${productDescription}
${productPrice ? `Price: ${productPrice}` : ''}

Check it out here: ${currentUrl}

Best regards,
Élégance Perfumes`
    
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = url
    setIsOpen(false)
  }
  
  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      toast.success('Link copied to clipboard!')
      setIsOpen(false)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }
  
  // Share options configuration
  const shareOptions = [
    {
      name: 'Facebook',
      icon: <FiFacebook className="w-5 h-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: shareOnFacebook
    },
    {
      name: 'Twitter',
      icon: <FiTwitter className="w-5 h-5" />,
      color: 'bg-sky-500 hover:bg-sky-600',
      action: shareOnTwitter
    },
    {
      name: 'Instagram',
      icon: <FiInstagram className="w-5 h-5" />,
      color: 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
      action: shareOnInstagram
    },
    {
      name: 'WhatsApp',
      icon: <FiMessageCircle className="w-5 h-5" />,
      color: 'bg-green-500 hover:bg-green-600',
      action: shareOnWhatsApp
    },
    {
      name: 'Email',
      icon: <FiMail className="w-5 h-5" />,
      color: 'bg-gray-500 hover:bg-gray-600',
      action: shareViaEmail
    },
    {
      name: 'Copy Link',
      icon: <FiLink className="w-5 h-5" />,
      color: 'bg-primary-200 hover:bg-primary-300',
      action: copyLink
    }
  ]

  return (
    <div className="relative">
      {/* Main Share Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="glass-card p-3 rounded-full hover:bg-white/20 transition-colors group"
        aria-label="Share product"
      >
        <FiShare2 className="w-5 h-5 text-primary-500 group-hover:text-primary-300 transition-colors" />
      </motion.button>

      {/* Share Options Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            
            {/* Options Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`absolute z-50 ${
                position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
              } right-0 min-w-70`}
            >
              <div className="glass-card rounded-2xl p-4 shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-primary-500">
                    Share this product
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <FiX className="w-4 h-4 text-primary-500/70" />
                  </button>
                </div>
                
                {/* Share Options Grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {shareOptions.map((option) => (
                    <motion.button
                      key={option.name}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={option.action}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl text-white transition-all ${option.color}`}
                      title={`Share on ${option.name}`}
                    >
                      {option.icon}
                      <span className="text-xs mt-2 font-medium">
                        {option.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
                
                {/* Product Preview (on product pages) */}
                {product && (
                  <div className="pt-4 border-t border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <img
                          src={productImage}
                          alt={productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-primary-500 text-sm truncate">
                          {productName}
                        </p>
                        {productPrice && (
                          <p className="text-primary-500/70 text-xs">
                            {productPrice}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ShareButton