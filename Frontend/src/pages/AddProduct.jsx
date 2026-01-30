import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUpload, FiCheck } from 'react-icons/fi';
import { useUser } from '../context/UserContext';
import ProductForm from '../components/ProductForm';
import Loader from '../components/Loader';

const AddProduct = () => {
  const navigate = useNavigate();
  const { createProduct, loading } = useUser();
  const [success, setSuccess] = useState(false);
  const [createdProduct, setCreatedProduct] = useState(null);

  const handleSubmit = async (productData, images) => {
    const result = await createProduct(productData, images);
    
    if (result.success) {
      setCreatedProduct(result.product);
      setSuccess(true);
      
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate('/dashboard/products');
      }, 3000);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/products');
  };

  if (loading && !success) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard/products')}
        className="flex items-center space-x-2 text-primary-500 hover:text-primary-300 mb-8 transition-colors"
      >
        <FiArrowLeft />
        <span>Back to Products</span>
      </button>

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="inline-block p-8 mb-6">
            <div className="w-32 h-32 rounded-full bg-linear-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto">
              <FiCheck className="w-16 h-16 text-green-500" />
            </div>
          </div>
          
          <h1 className="text-4xl font-playfair font-bold text-primary-500 mb-4">
            Product Listed Successfully!
          </h1>
          
          <p className="text-xl text-primary-500/70 mb-8">
            Your product "{createdProduct?.name}" has been submitted for review.
          </p>
          
          <div className="glass-card rounded-xl p-6 max-w-md mx-auto mb-8">
            <h3 className="font-semibold text-primary-500 mb-4">
              What's Next?
            </h3>
            <ul className="space-y-3 text-left">
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FiCheck className="w-4 h-4" />
                </div>
                <span className="text-primary-500/80">Our team will review your listing within 24-48 hours</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FiCheck className="w-4 h-4" />
                </div>
                <span className="text-primary-500/80">You'll receive an email once it's approved</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FiCheck className="w-4 h-4" />
                </div>
                <span className="text-primary-500/80">Manage your product from the dashboard</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard/products')}
              className="glass-card px-8 py-3 rounded-full text-primary-500 font-medium hover:bg-white/20 transition-colors"
            >
              View My Products
            </button>
            <button
              onClick={() => navigate('/dashboard/products/new')}
              className="glass-button px-8 py-3 rounded-full text-white font-semibold"
            >
              List Another Product
            </button>
          </div>
          
          <p className="text-sm text-primary-500/60 mt-8">
            Redirecting to products page in 3 seconds...
          </p>
        </motion.div>
      ) : (
        <>
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-playfair font-bold text-primary-500 mb-2">
              List a New Product
            </h1>
            <p className="text-primary-500/70">
              Fill in the details below to list your perfume for sale
            </p>
          </div>

          {/* Form */}
          <ProductForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />

          {/* Tips */}
          <div className="mt-12 glass-card rounded-xl p-8">
            <h3 className="text-xl font-semibold text-primary-500 mb-4">
              Tips for Successful Listings
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <FiUpload className="w-4 h-4 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-500">Quality Photos</h4>
                    <p className="text-sm text-primary-500/60">
                      Use clear, well-lit photos from multiple angles
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <span className="text-primary-500 font-bold">$</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-500">Competitive Pricing</h4>
                    <p className="text-sm text-primary-500/60">
                      Research similar listings for fair pricing
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <span className="text-primary-500 font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-500">Accurate Details</h4>
                    <p className="text-sm text-primary-500/60">
                      Provide complete and honest condition descriptions
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                    <span className="text-primary-500 font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-500">Shipping Ready</h4>
                    <p className="text-sm text-primary-500/60">
                      Be prepared to ship within 2 business days
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AddProduct;