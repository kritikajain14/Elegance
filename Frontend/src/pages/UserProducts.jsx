import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiFilter, FiX, FiCheck, FiClock , FiPackage } from 'react-icons/fi';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import API from '../utils/api'


const UserProducts = () => {
  const navigate = useNavigate();
  const { userProducts, getUserProducts, deleteProduct, loading } = useUser();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    getUserProducts();
  }, [user, navigate, getUserProducts]);

  const filters = [
    { value: 'all', label: 'All Products' },
    { value: 'approved', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'sold', label: 'Sold' },
    { value: 'draft', label: 'Drafts' }
  ];

  const filteredProducts = userProducts.filter(product => {
    if (filter === 'all') return true;
    return product.status === filter;
  });

  const handleActivate = async (productId) => {
  try {
    await API.put(`/user/products/${productId}/activate`);
    toast.success('Product activated successfully');
    getUserProducts();
  } catch (error) {
    toast.error('Failed to activate product');
  }
};



//   const handleApprove = async (productId) => {
//   try {
//     const res = await fetch(`/api/admin/products/${productId}/approve`, {
//       method: 'PUT',
//       headers: {
//         Authorization: `Bearer ${user.token}`
//       }
//     });
//     const data = await res.json();
//     if (!res.ok) throw new Error(data.message || 'Approval failed');
//     toast.success('Product approved!');
//     getUserProducts(); // refresh list
//   } catch (error) {
//     toast.error(error.message);
//   }
// };

  const handleDelete = async (productId) => {
    try {
      setDeletingId(productId);
      const result = await deleteProduct(productId);
      if (result.success) {
        getUserProducts();
        toast.success('Product deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setDeletingId(null);
      setShowDeleteConfirm(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'sold': return 'bg-blue-100 text-blue-600';
      case 'draft': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FiCheck className="w-4 h-4" />;
      case 'pending': return <FiClock className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading && userProducts.length === 0) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-playfair font-bold text-primary-500 mb-2">
            My Products
          </h1>
          <p className="text-primary-500/70">
            Manage your perfume listings and track their performance
          </p>
        </div>
        
        <button
          onClick={() => navigate('/dashboard/products/new')}
          className="glass-button px-6 py-3 rounded-full text-white font-semibold flex items-center space-x-2"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <FiFilter className="w-5 h-5 text-primary-500/70" />
          <span className="text-primary-500/70">Filter by:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((filterItem) => (
            <button
              key={filterItem.value}
              onClick={() => setFilter(filterItem.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === filterItem.value
                  ? 'glass-button text-white'
                  : 'glass-card text-primary-500 hover:bg-white/20'
              }`}
            >
              {filterItem.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <AnimatePresence>
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card rounded-xl p-12 text-center"
          >
            <FiPackage className="w-20 h-20 text-primary-300 mx-auto mb-6" />
            <h3 className="text-2xl font-playfair font-bold text-primary-500 mb-4">
              {filter === 'all' ? 'No Products Yet' : `No ${filter} Products`}
            </h3>
            <p className="text-primary-500/70 mb-8 max-w-md mx-auto">
              {filter === 'all'
                ? 'Start your perfume selling journey by listing your first product!'
                : `You don't have any ${filter} products at the moment.`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/dashboard/products/new')}
                className="glass-button px-8 py-3 rounded-full text-white font-semibold"
              >
                List Your First Product
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex space-x-4 mb-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="grow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-primary-500 line-clamp-2">
                        {product.name}
                      </h3>
                      <span className={`text-xs px-3 py-1 rounded-full flex items-center space-x-1 ${getStatusColor(product.status)}`}>
                        {getStatusIcon(product.status)}
                        <span>{product.status}</span>
                      </span>
                    </div>
                    
                    <p className="text-sm text-primary-500/60 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-primary-500">
                          ${product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-primary-500/50 line-through ml-2">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-primary-500/70">
                        Stock: {product.stock}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-b border-white/20">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary-500">
                      {product.views || 0}
                    </div>
                    <div className="text-xs text-primary-500/60">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary-500">
                      {product.soldCount || 0}
                    </div>
                    <div className="text-xs text-primary-500/60">Sold</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary-500">
                      {product.rating || 0}
                    </div>
                    <div className="text-xs text-primary-500/60">Rating</div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="flex-1 glass-card py-2 rounded-lg text-primary-500 font-medium hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FiEye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  
                  <button
                    onClick={() => navigate(`/dashboard/products/${product._id}/edit`)}
                    className="flex-1 glass-card py-2 rounded-lg text-primary-500 font-medium hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FiEdit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>

                  {product.status === 'pending' && (
  <button
    onClick={() => handleActivate(product._id)}
    className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
  >
    Activate
  </button>
)}

                  
                  {showDeleteConfirm === product._id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deletingId === product._id}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        {deletingId === product._id ? 'Deleting...' : 'Confirm'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="px-4 py-2 glass-card text-primary-500 rounded-lg hover:bg-white/20 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowDeleteConfirm(product._id)}
                      className="glass-card p-2 rounded-lg text-primary-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Delete product"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Stats Summary */}
      {userProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <div className="glass-card rounded-xl p-8">
            <h3 className="text-xl font-semibold text-primary-500 mb-6">
              Product Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-500 mb-2">
                  {userProducts.length}
                </div>
                <div className="text-primary-500/70">Total Listed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {userProducts.filter(p => p.status === 'approved').length}
                </div>
                <div className="text-primary-500/70">Active</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500 mb-2">
                  {userProducts.filter(p => p.status === 'pending').length}
                </div>
                <div className="text-primary-500/70">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {userProducts.reduce((total, p) => total + (p.soldCount || 0), 0)}
                </div>
                <div className="text-primary-500/70">Total Sold</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserProducts;