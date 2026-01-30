import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiCreditCard, FiPackage, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { usePayment } from '../context/PaymentContext';
import { useAuth } from '../context/AuthContext';
import ShippingForm from '../components/ShippingForm';
import CheckoutForm from '../components/CheckoutForm';
import OrderSummary from '../components/OrderSummary';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import API from '../utils/api';

// Load Stripe
let stripePromise;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal } = useCart();
  const { user } = useAuth();
  const { createPaymentIntent, createOrder, clearPaymentData } = usePayment();
  
  const [step, setStep] = useState('shipping');
  const [loading, setLoading] = useState(true);
  const [stripeConfig, setStripeConfig] = useState(null);
  const [paymentData, setPaymentData] = useState({
    shippingAddress: null,
    itemsPrice: 0,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
    clientSecret: ''
  });

  useEffect(() => {
    // Check if cart is empty
    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    // Check if user is logged in
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
      return;
    }

    // Fetch Stripe config
    const fetchStripeConfig = async () => {
      try {
        const response = await API.get('/payments/config');
        setStripeConfig(response.data);
      } catch (error) {
        console.error('Error fetching Stripe config:', error);
        toast.error('Payment system is currently unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchStripeConfig();
  }, [cart, user, navigate]);

  const handleShippingSubmit = async (shippingAddress) => {
    try {
      setLoading(true);
      
      // Calculate prices
      const itemsPrice = getCartTotal();
      const taxPrice = itemsPrice * 0.08;
      const shippingPrice = itemsPrice > 100 ? 0 : 10;
      const totalPrice = itemsPrice + taxPrice + shippingPrice;

      // Create payment intent
      const result = await createPaymentIntent(shippingAddress);
      
      if (result.success) {
        setPaymentData({
          shippingAddress,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
          clientSecret: result.clientSecret
        });
        setStep('payment');
        toast.success('Proceed to payment');
      }
    } catch (error) {
      toast.error('Failed to process shipping information');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      setLoading(true);
      
      // Create order in database
      const orderData = {
        paymentIntentId: paymentIntent.id,
        items: cart.items,
        shippingAddress: paymentData.shippingAddress,
        taxPrice: paymentData.taxPrice,
        shippingPrice: paymentData.shippingPrice,
        itemsPrice: paymentData.itemsPrice,
        totalPrice: paymentData.totalPrice
      };

      const result = await createOrder(orderData);
      
      if (result.success) {
        clearPaymentData();
        navigate(`/order-success/${result.order._id}`);
      }
    } catch (error) {
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (step === 'shipping') {
      navigate('/cart');
    } else if (step === 'payment') {
      setStep('shipping');
      clearPaymentData();
    }
  };

  if (loading) return <Loader />;

  const checkoutSteps = [
    { id: 'shipping', label: 'Shipping', icon: FiPackage },
    { id: 'payment', label: 'Payment', icon: FiCreditCard },
    { id: 'confirmation', label: 'Confirmation', icon: FiCheck }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/cart')}
        className="flex items-center space-x-2 text-primary-500 hover:text-primary-300 mb-8 transition-colors"
      >
        <FiArrowLeft />
        <span>Back to Cart</span>
      </button>

      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-playfair font-bold text-primary-500 mb-4">
          Checkout
        </h1>
        <p className="text-primary-500/70">
          Complete your purchase in a few simple steps
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex justify-center">
          <div className="flex items-center space-x-8">
            {checkoutSteps.map((checkoutStep, index) => {
              const StepIcon = checkoutStep.icon;
              const isActive = checkoutStep.id === step;
              const isCompleted = checkoutSteps.findIndex(s => s.id === step) > index;

              return (
                <div key={checkoutStep.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{ 
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isActive || isCompleted 
                          ? 'rgba(242, 68, 85, 0.9)' 
                          : 'rgba(255, 255, 255, 0.1)',
                        color: isActive || isCompleted ? '#FFFFFF' : 'rgba(43, 0, 19, 0.5)'
                      }}
                      className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-primary-300 mb-2 transition-all duration-300"
                    >
                      <StepIcon className="w-6 h-6" />
                    </motion.div>
                    <span className={`text-sm font-medium ${
                      isActive || isCompleted ? 'text-primary-500' : 'text-primary-500/50'
                    }`}>
                      {checkoutStep.label}
                    </span>
                  </div>
                  
                  {index < checkoutSteps.length - 1 && (
                    <div className={`w-16 h-1 ${
                      isCompleted ? 'bg-primary-300' : 'bg-primary-100'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === 'shipping' && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <ShippingForm
                  onSubmit={handleShippingSubmit}
                  onCancel={handleCancel}
                  initialData={user ? {
                    firstName: user.name?.split(' ')[0] || '',
                    lastName: user.name?.split(' ')[1] || '',
                    email: user.email || ''
                  } : {}}
                />
              </motion.div>
            )}

            {step === 'payment' && paymentData.clientSecret && stripeConfig && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Elements 
                  stripe={getStripe()} 
                  options={{
                    clientSecret: paymentData.clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#F24455',
                        colorBackground: '#ffffff',
                        colorText: '#2B0013',
                        colorDanger: '#ef4444',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        spacingUnit: '4px',
                        borderRadius: '12px'
                      }
                    }
                  }}
                >
                  <CheckoutForm
                    amount={paymentData.totalPrice}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handleCancel}
                  />
                </Elements>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary
            items={cart.items}
            itemsPrice={paymentData.itemsPrice || getCartTotal()}
            taxPrice={paymentData.taxPrice || (getCartTotal() * 0.08)}
            shippingPrice={paymentData.shippingPrice || (getCartTotal() > 100 ? 0 : 10)}
            totalPrice={paymentData.totalPrice || 
              (getCartTotal() + (getCartTotal() * 0.08) + (getCartTotal() > 100 ? 0 : 10))}
          />
        </div>
      </div>

      {/* Security Footer */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center space-x-4 text-primary-500/50 text-sm">
          <span>🔒 SSL Secure</span>
          <span>•</span>
          <span>256-bit Encryption</span>
          <span>•</span>
          <span>PCI Compliant</span>
          <span>•</span>
          <span>Stripe Powered</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;