import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial from-primary-50/30 via-transparent to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-primary-500 mb-6 leading-tight">
              Discover Your
              <span className="block gradient-text">Signature Scent</span>
            </h1>
            
            <p className="text-xl text-primary-500/80 mb-8 leading-relaxed">
              Experience luxury perfumes crafted with passion. Each scent tells a story, 
              each bottle holds an emotion. Find the fragrance that speaks to your soul.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-button px-8 py-4 rounded-full text-white font-semibold text-lg flex items-center space-x-2 group"
                >
                  <span>Shop Now</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </motion.button>
              </Link>
              
              <Link to="/products?isNewArrival=true">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-card px-8 py-4 rounded-full text-primary-500 font-semibold text-lg border border-white/30 hover:border-primary-200 transition-colors"
                >
                  New Arrivals
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Glass bottle mockup */}
              <div className="glass-card rounded-3xl p-8">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  <img
                    src="./images/MissDior.png"
                    alt="Luxury Perfume"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full bg-primary-200/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </section>
  )
}

export default Hero