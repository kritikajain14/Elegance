import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { FiCreditCard, FiLock, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CheckoutForm = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setMessage('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required'
    });

    if (error) {
      console.error(error);
      setMessage(error.message || 'Payment failed');
      toast.error(error.message || 'Payment failed');
      setIsProcessing(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      toast.success('Payment successful');
      setMessage('Payment successful');
      onSuccess(paymentIntent); // ✅ createOrder happens outside
      return;
    }

    setMessage('Payment not completed');
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-primary-500">
              Payment Details
            </h3>
            <p className="text-sm text-primary-500/60">
              Secure payment processed by Stripe
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <FiLock className="w-5 h-5 text-green-500" />
            <span className="text-sm text-green-500 font-medium">Secure</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-primary-500/70">Total Amount</span>
            <span className="text-2xl font-bold text-primary-500">
              ${amount.toFixed(2)}
            </span>
          </div>

          <PaymentElement
            options={{
              layout: 'accordion',
              paymentMethodOrder: ['card'],
              wallets: {
                applePay: 'never',
                googlePay: 'never'
              }
            }}
            onChange={(e) => setIsComplete(e.complete)}
          />
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg mb-4 ${
              message.includes('successful')
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 glass-card py-3 rounded-lg text-primary-500 font-medium hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!stripe || !elements || isProcessing || !isComplete}
            className={`flex-1 glass-button py-3 rounded-lg text-white font-semibold flex items-center justify-center space-x-2 ${
              (!stripe || !elements || isProcessing || !isComplete)
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {isProcessing ? (
              <>
                <div className="loading-spinner w-5 h-5 border-2 border-white/30 border-t-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FiCreditCard className="w-5 h-5" />
                <span>Pay ${amount.toFixed(2)}</span>
              </>
            )}
          </motion.button>
        </div>

        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <FiLock className="w-4 h-4 text-primary-500/60" />
              <span className="text-xs text-primary-500/60">SSL Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <FiCheck className="w-4 h-4 text-primary-500/60" />
              <span className="text-xs text-primary-500/60">Encrypted</span>
            </div>
          </div>
          <p className="text-xs text-center text-primary-500/40 mt-2">
            Your payment information is encrypted and secure
          </p>
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;
