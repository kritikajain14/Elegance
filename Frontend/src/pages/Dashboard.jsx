import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiPackage, FiDollarSign, FiSettings, FiTrendingUp, FiGrid } from 'react-icons/fi';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import DashboardStats from '../components/DashboardStats';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { dashboardStats, getDashboardStats, userProducts, getUserProducts, loading } = useUser();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) {
      toast.error('Please login to access dashboard');
      navigate('/login');
      return;
    }

    getDashboardStats();
    getUserProducts();
    // navigate, getDashboardStats, getUserProducts
  }, [user]);

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'List a new perfume for sale',
      icon: FiPlus,
      color: 'from-primary-200 to-primary-300',
      path: '/dashboard/products/new',
      action: () => navigate('/dashboard/products/new')
    },
    {
      title: 'View My Products',
      description: 'Manage your listings',
      icon: FiPackage,
      color: 'from-blue-500 to-cyan-500',
      path: '/dashboard/products',
      action: () => navigate('/dashboard/products')
    },
    {
      title: 'Sales Analytics',
      description: 'View sales performance',
      icon: FiTrendingUp,
      color: 'from-green-500 to-emerald-500',
      path: '/dashboard/analytics',
      action: () => navigate('/dashboard/analytics')
    },
    {
      title: 'Seller Settings',
      description: 'Update profile & preferences',
      icon: FiSettings,
      color: 'from-purple-500 to-pink-500',
      path: '/dashboard/settings',
      action: () => navigate('/dashboard/settings')
    }
  ];

  if (loading && !dashboardStats) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-playfair font-bold text-primary-500 mb-2">
          Seller Dashboard
        </h1>
        <p className="text-primary-500/70">
          Welcome back, {user?.name}! Manage your perfume listings and sales.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mb-8">
        <DashboardStats stats={dashboardStats} />
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-primary-500 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={action.action}
              className="glass-card rounded-xl p-6 text-left hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-12 h-12 rounded-full bg-linear-to-r ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h3 className="font-semibold text-primary-500 group-hover:text-primary-300 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-primary-500/60">
                    {action.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-primary-300 group-hover:text-primary-200 transition-colors">
                <span className="text-sm font-medium">Get Started</span>
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Products */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-primary-500">
            Recent Products
          </h2>
          <Link to="/dashboard/products">
            <button className="text-primary-300 hover:text-primary-200 font-medium">
              View All →
            </button>
          </Link>
        </div>

        {userProducts.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <FiPackage className="w-16 h-16 text-primary-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary-500 mb-2">
              No Products Listed Yet
            </h3>
            <p className="text-primary-500/70 mb-6">
              Start selling by listing your first perfume!
            </p>
            <button
              onClick={() => navigate('/dashboard/products/new')}
              className="glass-button px-6 py-3 rounded-full text-white font-medium"
            >
              List Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProducts.slice(0, 6).map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex space-x-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grow">
                    <h4 className="font-semibold text-primary-500 line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-sm text-primary-500/60 mb-2">
                      {product.size} • {product.condition}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary-500">
                        ${product.price}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.status === 'approved' ? 'bg-green-100 text-green-600' :
                        product.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        product.status === 'sold' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/dashboard/products/${product._id}/edit`)}
                      className="flex-1 glass-card py-2 rounded-lg text-primary-500 text-sm font-medium hover:bg-white/20 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="flex-1 glass-button py-2 rounded-lg text-white text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Seller Tips */}
      <div className="glass-card rounded-xl p-8 bg-linear-to-r from-primary-50/50 to-transparent">
        <h2 className="text-2xl font-playfair font-bold text-primary-500 mb-6">
          Seller Tips & Best Practices
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <span className="text-primary-500 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-primary-500 mb-1">High-Quality Photos</h4>
                <p className="text-primary-500/70 text-sm">
                  Use clear, well-lit photos from multiple angles. Show the bottle, packaging, and any unique features.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <span className="text-primary-500 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-primary-500 mb-1">Detailed Descriptions</h4>
                <p className="text-primary-500/70 text-sm">
                  Include scent notes, concentration, batch codes, and accurate condition descriptions.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <span className="text-primary-500 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-primary-500 mb-1">Competitive Pricing</h4>
                <p className="text-primary-500/70 text-sm">
                  Research similar listings and price competitively. Consider offering free shipping for better visibility.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                <span className="text-primary-500 font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-primary-500 mb-1">Fast Shipping</h4>
                <p className="text-primary-500/70 text-sm">
                  Ship items quickly and provide tracking. Good shipping practices lead to better reviews and ratings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;