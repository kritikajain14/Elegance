import { createContext, useState, useContext, useEffect } from 'react'
import API from '../utils/api'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] })
  const [loading, setLoading] = useState(false)
  const { isAuthenticated, loading: authLoading } = useAuth()


  const fetchCart = async () => {
    if (!isAuthenticated) return
    
    try {
      setLoading(true)
      const { data } = await API.get('/cart')
      setCart(data)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }
useEffect(() => {
  if (authLoading) return   // 🔑 KEY LINE

  if (isAuthenticated) {
    fetchCart()
  } else {
    setCart({ items: [] })
  }
}, [isAuthenticated, authLoading])


  // const addToCart = async (productId, quantity = 1) => {
  //   try {
  //     if (!isAuthenticated) {
  //       toast.error('Please login to add items to cart')
  //       return null
  //     }

  //     const { data } = await API.post('/cart/add', { productId, quantity })
  //     setCart(data)
  //     toast.success('Added to cart!')
  //     return data
  //   } catch (error) {
  //     throw error
  //   }
  // }

  const addToCart = async (productId, quantity = 1) => {
  const token = localStorage.getItem('token');

  if (!isAuthenticated || !token) {
    toast.error('Please login to add items to cart');
    navigate('/login'); // optional redirect to login
    return null;
  }

  try {
    const { data } = await API.post('/cart/add', { productId, quantity });
    setCart(data);
    toast.success('Added to cart!');
    return data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    toast.error(error.response?.data?.message || 'Failed to add to cart');
    throw error;
  }
};


  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await API.put('/cart/update', { productId, quantity })
      setCart(data)
      toast.success('Cart updated')
    } catch (error) {
      throw error
    }
  }

  const removeFromCart = async (productId) => {
    try {
      const { data } = await API.delete(`/cart/remove/${productId}`)
      setCart(data)
      toast.success('Item removed from cart')
    } catch (error) {
      throw error
    }
  }

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.productId?.price || 0) * item.quantity
    }, 0)
  }

  const getCartCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0)
  }

  const clearCart = () => {
    setCart({ items: [] })
  }

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartCount,
    clearCart,
    fetchCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}