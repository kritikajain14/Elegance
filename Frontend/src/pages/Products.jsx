import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductGrid from '../components/ProductGrid'
import API from '../utils/api'
import Loader from '../components/Loader'
import { FiFilter, FiX } from 'react-icons/fi'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  
  const category = searchParams.get('category')
  const isNewArrival = searchParams.get('isNewArrival')
  const isPopular = searchParams.get('isPopular')
  const search = searchParams.get('search')

  useEffect(() => {
    fetchProducts()
  }, [category, isNewArrival, isPopular, search])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {}
      if (category) params.category = category
      if (isNewArrival) params.isNewArrival = isNewArrival
      if (isPopular) params.isPopular = isPopular
      if (search) params.search = search
      
      const { data } = await API.get('/products', { params })
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = (filterType, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(filterType, value)
    } else {
      params.delete(filterType)
    }
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSearchParams({})
  }

  if (loading) return <Loader />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-playfair font-bold text-primary-500 mb-2">
          Our Collection
        </h1>
        <p className="text-primary-500/70">
          {products.length} {category ? `${category} ` : ''}perfumes found
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Desktop */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="glass-card rounded-xl p-6 sticky top-32">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-primary-500">Filters</h3>
              {(category || isNewArrival || isPopular) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-300 hover:text-primary-200"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-primary-500 mb-3">Category</h4>
              <div className="space-y-2">
                {['Men', 'Women', 'Unisex'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleFilter('category', cat)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      category === cat
                        ? 'bg-primary-100 text-primary-500'
                        : 'text-primary-500/70 hover:text-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    {cat} Perfumes
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h4 className="font-medium text-primary-500 mb-3">Status</h4>
              <div className="space-y-2">
                <button
                  onClick={() => handleFilter('isNewArrival', 'true')}
                  className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    isNewArrival === 'true'
                      ? 'bg-primary-100 text-primary-500'
                      : 'text-primary-500/70 hover:text-primary-300 hover:bg-primary-50'
                  }`}
                >
                  New Arrivals
                  <span className="text-xs bg-primary-200 text-white px-2 py-1 rounded">
                    New
                  </span>
                </button>
                <button
                  onClick={() => handleFilter('isPopular', 'true')}
                  className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    isPopular === 'true'
                      ? 'bg-primary-100 text-primary-500'
                      : 'text-primary-500/70 hover:text-primary-300 hover:bg-primary-50'
                  }`}
                >
                  Popular
                  <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">
                    Hot
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters - Mobile */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="glass-card px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            {showFilters ? <FiX /> : <FiFilter />}
            <span>Filters</span>
          </button>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card rounded-xl p-4 mt-2"
            >
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-primary-500 mb-2">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Men', 'Women', 'Unisex'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          handleFilter('category', cat)
                          setShowFilters(false)
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          category === cat
                            ? 'bg-primary-100 text-primary-500'
                            : 'bg-white/50 text-primary-500/70'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Products */}
        <div className="flex-1">
          {/* Active Filters */}
          {(category || isNewArrival || isPopular) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {category && (
                <span className="glass-card px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                  <span>{category}</span>
                  <button
                    onClick={() => handleFilter('category', null)}
                    className="hover:text-primary-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {isNewArrival && (
                <span className="glass-card px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                  <span>New Arrivals</span>
                  <button
                    onClick={() => handleFilter('isNewArrival', null)}
                    className="hover:text-primary-300"
                  >
                    ×
                  </button>
                </span>
              )}
              {isPopular && (
                <span className="glass-card px-3 py-1 rounded-full text-sm flex items-center space-x-2">
                  <span>Popular</span>
                  <button
                    onClick={() => handleFilter('isPopular', null)}
                    className="hover:text-primary-300"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-primary-500 mb-4">
                No perfumes found
              </h3>
              <p className="text-primary-500/70 mb-6">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={clearFilters}
                className="glass-button px-6 py-2 rounded-full text-white"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products