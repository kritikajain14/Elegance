import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiTruck, FiHome, FiShoppingBag } from 'react-icons/fi';
import { usePayment } from '../context/PaymentContext';
import Loader from '../components/Loader';
import API from '../utils/api';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/payments/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) return <Loader />;

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-primary-500 mb-4">
          Order Not Found
        </h2>
        <p className="text-primary-500/70 mb-8">
          We couldn't find your order. Please check your order history.
        </p>
        <Link to="/products">
          <button className="glass-button px-8 py-3 rounded-full text-white font-semibold">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-block p-6 bg-linear-to-r from-green-100 to-emerald-100 rounded-full mb-6">
          <FiCheckCircle className="w-24 h-24 text-green-500" />
        </div>
        <h1 className="text-4xl font-playfair font-bold text-primary-500 mb-4">
          Order Confirmed!
        </h1>
        <p className="text-xl text-primary-500/70 mb-2">
          Thank you for your purchase, {order.shippingAddress.firstName}!
        </p>
        <p className="text-primary-500/60">
          Order #{order._id.slice(-8).toUpperCase()} • Placed on{' '}
          {new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-primary-500 mb-4">
            Order Details
          </h3>
          
          <div className="space-y-4">
            {order.orderItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-500">{item.name}</h4>
                    <p className="text-sm text-primary-500/60">
                      {item.size} • Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-500">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-primary-500/70">
              <span>Subtotal</span>
              <span>${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-primary-500/70">
              <span>Tax</span>
              <span>${order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-primary-500/70">
              <span>Shipping</span>
              <span className={order.shippingPrice === 0 ? 'text-green-500' : ''}>
                {order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-white/20 pt-4">
              <div className="flex justify-between font-bold text-primary-500 text-xl">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Shipping Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <FiTruck className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-500">Shipping Details</h3>
                <p className="text-sm text-primary-500/60">Your order will be shipped to:</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-primary-500">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p className="text-primary-500/80">{order.shippingAddress.address}</p>
              <p className="text-primary-500/80">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p className="text-primary-500/80">{order.shippingAddress.country}</p>
              <p className="text-primary-500/80">{order.shippingAddress.email}</p>
              <p className="text-primary-500/80">{order.shippingAddress.phone}</p>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <FiPackage className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-500">Order Status</h3>
                <p className="text-sm text-primary-500/60">Current order progress</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-primary-500/70">Payment Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 text-sm rounded-full">
                  Paid
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary-500/70">Order Status</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full">
                  Processing
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-primary-500/70">Estimated Delivery</span>
                <span className="font-medium text-primary-500">
                  {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-xl p-8 text-center"
      >
        <h3 className="text-2xl font-playfair font-bold text-primary-500 mb-6">
          What's Next?
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-8 h-8 text-primary-500" />
            </div>
            <h4 className="font-semibold text-primary-500 mb-2">
              Order Confirmation
            </h4>
            <p className="text-primary-500/70 text-sm">
              You'll receive an email confirmation shortly with your order details.
            </p>
          </div>
          
          <div className="p-6">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <FiPackage className="w-8 h-8 text-primary-500" />
            </div>
            <h4 className="font-semibold text-primary-500 mb-2">
              Order Processing
            </h4>
            <p className="text-primary-500/70 text-sm">
              We'll prepare your order and notify you when it ships.
            </p>
          </div>
          
          <div className="p-6">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
              <FiTruck className="w-8 h-8 text-primary-500" />
            </div>
            <h4 className="font-semibold text-primary-500 mb-2">
              Delivery
            </h4>
            <p className="text-primary-500/70 text-sm">
              Track your order with the tracking number we'll send you.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/products">
            <button className="glass-card px-8 py-3 rounded-full text-primary-500 font-medium hover:bg-white/20 transition-colors flex items-center space-x-2">
              <FiShoppingBag className="w-5 h-5" />
              <span>Continue Shopping</span>
            </button>
          </Link>
          
          <Link to="/">
            <button className="glass-button px-8 py-3 rounded-full text-white font-semibold flex items-center space-x-2">
              <FiHome className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;