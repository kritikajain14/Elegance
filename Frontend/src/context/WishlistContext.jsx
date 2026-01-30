import { createContext, useState, useContext, useEffect } from 'react';
import API from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [wishlistStatus, setWishlistStatus] = useState({}); // Track wishlist status per product
  const { isAuthenticated } = useAuth();

  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const { data } = await API.get('/wishlist');
      setWishlist(data);
      
      // Update wishlist status
      const status = {};
      data.items.forEach(item => {
        if (item.productId) {
          status[item.productId._id] = true;
        }
      });
      setWishlistStatus(status);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async (productId) => {
    if (!isAuthenticated) return false;
    
    try {
      const { data } = await API.get(`/wishlist/check/${productId}`);
      return data.inWishlist;
    } catch (error) {
      console.error('Error checking wishlist status:', error);
      return false;
    }
  };

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return { success: false };
    }

    try {
      setLoading(true);
      const { data } = await API.post('/wishlist/add', { productId });
      setWishlist(data.wishlist);
      setWishlistStatus(prev => ({ ...prev, [productId]: true }));
      toast.success('Added to wishlist! 💖');
      return { success: true, wishlist: data.wishlist };
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message === 'Product already in wishlist') {
        // If already in wishlist, remove it
        return await removeFromWishlist(productId);
      }
      toast.error('Failed to add to wishlist');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true);
      const { data } = await API.delete(`/wishlist/remove/${productId}`);
      setWishlist(data.wishlist);
      setWishlistStatus(prev => ({ ...prev, [productId]: false }));
      toast.success('Removed from wishlist');
      return { success: true, wishlist: data.wishlist };
    } catch (error) {
      toast.error('Failed to remove from wishlist');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    const isInWishlist = wishlistStatus[productId];
    
    if (isInWishlist) {
      return await removeFromWishlist(productId);
    } else {
      return await addToWishlist(productId);
    }
  };

  const clearWishlist = async () => {
    try {
      setLoading(true);
      await API.delete('/wishlist/clear');
      setWishlist({ items: [] });
      setWishlistStatus({});
      toast.success('Wishlist cleared');
      return { success: true };
    } catch (error) {
      toast.error('Failed to clear wishlist');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getWishlistCount = () => {
    return wishlist.items?.length || 0;
  };

  const isInWishlist = (productId) => {
    return wishlistStatus[productId] || false;
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist({ items: [] });
      setWishlistStatus({});
    }
  }, [isAuthenticated]);

  const value = {
    wishlist,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    getWishlistCount,
    isInWishlist,
    checkWishlistStatus,
    fetchWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};