import { motion } from 'framer-motion';
import { FiPackage, FiTruck, FiShield, FiClock } from 'react-icons/fi';

const OrderSummary = ({ items, itemsPrice, taxPrice, shippingPrice, totalPrice }) => {
  return (
    <div className="space-y-6">
      {/* Order Items */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-xl font-semibold text-primary-500 mb-4">
          Order Summary
        </h3>
        
        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.productId._id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between py-3 border-b border-white/10"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <img
                    src={item.productId.images[0]}
                    alt={item.productId.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-primary-500">
                    {item.productId.name}
                  </h4>
                  <p className="text-sm text-primary-500/60">
                    {item.productId.size} • Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary-500">
                  ${(item.productId.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-primary-500/70">
            <span>Subtotal</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-primary-500/70">
            <span>Tax (8%)</span>
            <span>${taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-primary-500/70">
            <span>Shipping</span>
            <span className={shippingPrice === 0 ? 'text-green-500' : ''}>
              {shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
            </span>
          </div>
          <div className="border-t border-white/20 pt-4">
            <div className="flex justify-between font-bold text-primary-500 text-xl">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Features */}
      <div className="glass-card rounded-xl p-6">
        <h4 className="font-semibold text-primary-500 mb-4">
          Order Benefits
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <FiPackage className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="font-medium text-primary-500 text-sm">Free Shipping</p>
              <p className="text-xs text-primary-500/60">Over $100</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <FiClock className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="font-medium text-primary-500 text-sm">24/7 Support</p>
              <p className="text-xs text-primary-500/60">Always here</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <FiTruck className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="font-medium text-primary-500 text-sm">Fast Delivery</p>
              <p className="text-xs text-primary-500/60">2-3 days</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <FiShield className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="font-medium text-primary-500 text-sm">Secure Payment</p>
              <p className="text-xs text-primary-500/60">Encrypted</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Note */}
      <div className="glass-card rounded-xl p-6 bg-linear-to-r from-primary-50/30 to-transparent">
        <div className="flex items-center space-x-3">
          <FiShield className="w-6 h-6 text-green-500" />
          <div>
            <p className="font-medium text-primary-500">
              Secure & Encrypted Checkout
            </p>
            <p className="text-sm text-primary-500/60">
              Your payment information is protected with 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;