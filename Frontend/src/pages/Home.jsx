import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import API from '../utils/api'
import Loader from '../components/Loader'

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([])
  const [popularProducts, setPopularProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const [newArrivalsRes, popularRes] = await Promise.all([
        API.get('/products/new-arrivals'),
        API.get('/products/popular')
      ])
      setNewArrivals(newArrivalsRes.data)
      setPopularProducts(popularRes.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      <Hero />
      
      {/* New Arrivals */}
      <section className="py-16 bg-linear-to-b from-transparent to-primary-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-playfair font-bold text-primary-500 mb-2">
                  New Arrivals
                </h2>
                <p className="text-primary-500/70">
                  Discover our latest fragrance creations
                </p>
              </div>
            </div>
            <ProductGrid products={newArrivals.slice(0, 4)} />
          </motion.div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-playfair font-bold text-primary-500 mb-2">
                  Most Popular
                </h2>
                <p className="text-primary-500/70">
                  Our customer favorites
                </p>
              </div>
            </div>
            <ProductGrid products={popularProducts.slice(0, 4)} />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 text-center"
          >
            <h3 className="text-5xl font-playfair font-bold text-primary-500 mb-6">
              Find Your Perfect Scent
            </h3>
            <p className="text-xl text-primary-500/80 mb-8 max-w-2xl mx-auto">
              Each fragrance tells a unique story. Discover the one that resonates with your personality.
            </p>
            <a href="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button px-10 py-4 rounded-full text-white font-semibold text-lg"
              >
                Browse All Perfumes
              </motion.button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home