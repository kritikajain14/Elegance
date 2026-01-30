import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Dashboard from './pages/Dashboard' 
import UserProducts from './pages/UserProducts' 
import AddProduct from './pages/AddProduct' 
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { UserProvider } from './context/UserContext' // Add this
import { PaymentProvider } from './context/PaymentContext'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <UserProvider> {/* Add this provider */}
            <PaymentProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <AnimatePresence mode="wait">
                  <motion.main
                    key={location.pathname}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grow"
                  >
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/:id" element={<ProductDetails />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                      <Route path="/dashboard" element={<Dashboard />} /> {/* Add dashboard routes */}
                      <Route path="/dashboard/products" element={<UserProducts />} />
                      <Route path="/dashboard/products/new" element={<AddProduct />} />
                      <Route path="/dashboard/products/:id/edit" element={<AddProduct />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                    </Routes>
                  </motion.main>
                </AnimatePresence>
                <Footer />
              </div>
            </PaymentProvider>
          </UserProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App