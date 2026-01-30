import { createContext, useState, useContext } from 'react';
import API from '../utils/api';
import { useCart } from './CartContext';
import toast from 'react-hot-toast';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const { cart, getCartTotal, clearCart } = useCart();

  // ✅ STEP 1: Create PaymentIntent
  const createPaymentIntent = async (shippingAddress) => {
    try {
      setLoading(true);

      const itemsPrice = getCartTotal();
      const taxPrice = itemsPrice * 0.08;
      const shippingPrice = itemsPrice > 100 ? 0 : 10;
      const totalPrice = itemsPrice + taxPrice + shippingPrice;

      const response = await API.post('/payments/create-payment-intent', {
        items: cart.items,
        shippingAddress,
        taxPrice,
        shippingPrice
      });

      setClientSecret(response.data.clientSecret);

      return {
        success: true,
        clientSecret: response.data.clientSecret,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast.error('Failed to initialize payment');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ✅ STEP 3: Create Order AFTER payment success
  const createOrder = async (orderData) => {
    try {
      setLoading(true);

      const response = await API.post('/payments/create-order', orderData);

      toast.success('Order placed successfully!');
      clearCart();

      return { success: true, order: response.data.order };
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const clearPaymentData = () => {
    setClientSecret('');
  };

  return (
    <PaymentContext.Provider
      value={{
        loading,
        clientSecret,
        createPaymentIntent,
        createOrder,
        clearPaymentData
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
