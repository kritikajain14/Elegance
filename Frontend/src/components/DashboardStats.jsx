import { motion } from 'framer-motion';
import { FiPackage, FiDollarSign, FiEye, FiStar, FiTrendingUp, FiUsers } from 'react-icons/fi';

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: FiPackage,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Products',
      value: stats?.activeProducts || 0,
      icon: FiTrendingUp,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending Approval',
      value: stats?.pendingProducts || 0,
      icon: FiPackage,
      color: 'from-yellow-500 to-amber-500',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Total Sales',
      value: `$${stats?.totalSales?.toFixed(2) || '0.00'}`,
      icon: FiDollarSign,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Total Views',
      value: stats?.totalViews || 0,
      icon: FiEye,
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Seller Rating',
      value: stats?.sellerRating?.toFixed(1) || '0.0',
      icon: FiStar,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-card rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-primary-500/70 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-primary-500">{stat.value}</p>
            </div>
              <stat.icon className={`w-7 h-7 bg-linear-to-r ${stat.color} bg-clip-text text-transparent`} />
            </div>
          
          {stat.title === 'Seller Rating' && stats?.sellerRating > 0 && (
            <div className="mt-4 flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(stats.sellerRating)
                      ? 'text-yellow-400 fill-current'
                      : i < stats.sellerRating
                      ? 'text-yellow-400 fill-current opacity-50'
                      : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm text-primary-500/70">
                ({stats.sellerRating.toFixed(1)})
              </span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;