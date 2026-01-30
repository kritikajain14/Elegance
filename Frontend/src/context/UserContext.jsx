import { createContext, useState, useContext } from 'react';
import API from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [userProducts, setUserProducts] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getUserProducts = async (params = {}) => {
    if (!user) return { products: [], total: 0 };
    
    try {
      setLoading(true);
      const response = await API.get('/user/products', { params });
      setUserProducts(response.data.products || []);
      return response.data;
    } catch (error) {
      console.error('Error fetching user products:', error);
      return { products: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  const getDashboardStats = async () => {
    if (!user) return null;
    
    try {
      setLoading(true);
      const response = await API.get('/user/dashboard/stats');
      setDashboardStats(response.data.stats);
      return response.data.stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData, images) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Append product data
      Object.keys(productData).forEach(key => {
        formData.append(key, productData[key]);
      });
      
      // Append images
      images.forEach((image, index) => {
        formData.append('images', image);
      });
      
      const response = await API.post('/user/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success(response.data.message || 'Product created successfully!');
      return { success: true, product: response.data.product };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, productData, newImages = []) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Append product data
      Object.keys(productData).forEach(key => {
        formData.append(key, productData[key]);
      });
      
      // Append new images
      newImages.forEach((image, index) => {
        formData.append('images', image);
      });
      
      const response = await API.put(`/user/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Product updated successfully!');
      return { success: true, product: response.data.product };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      setLoading(true);
      await API.delete(`/user/products/${productId}`);
      toast.success('Product deleted successfully');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getUserProfile = async () => {
    try {
      setLoading(true);
      const response = await API.get('/user/profile');
      return { success: true, profile: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profileData, avatar) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      Object.keys(profileData).forEach(key => {
        formData.append(key, profileData[key]);
      });
      
      if (avatar) {
        formData.append('avatar', avatar);
      }
      
      const response = await API.put('/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Profile updated successfully!');
      return { success: true, profile: response.data.profile };
    } catch (error) {
      toast.error('Failed to update profile');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    userProducts,
    dashboardStats,
    loading,
    getUserProducts,
    getDashboardStats,
    createProduct,
    updateProduct,
    deleteProduct,
    getUserProfile,
    updateUserProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};