import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiX, FiImage, FiTag, FiDollarSign, FiPackage, FiInfo } from 'react-icons/fi';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    longDescription: '',
    price: '',
    originalPrice: '',
    category: 'Unisex',
    size: '100ml',
    stock: '1',
    condition: 'New',
    brand: '',
    notes: '',
    concentration: 'Eau de Parfum',
    releaseYear: new Date().getFullYear().toString()
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        longDescription: product.longDescription || '',
        price: product.price?.toString() || '',
        originalPrice: product.originalPrice?.toString() || '',
        category: product.category || 'Unisex',
        size: product.size || '100ml',
        stock: product.stock?.toString() || '1',
        condition: product.condition || 'New',
        brand: product.brand || '',
        notes: product.notes?.join(', ') || '',
        concentration: product.concentration || 'Eau de Parfum',
        releaseYear: product.releaseYear?.toString() || new Date().getFullYear().toString()
      });
      setPreviewImages(product.images || []);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file size and type
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });
    
    if (images.length + validFiles.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    
    setImages(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.size) newErrors.size = 'Size is required';
    if (!formData.stock || parseInt(formData.stock) < 1) newErrors.stock = 'Stock must be at least 1';
    if (previewImages.length === 0) newErrors.images = 'At least one image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
      stock: parseInt(formData.stock),
      notes: formData.notes.split(',').map(note => note.trim()),
      releaseYear: formData.releaseYear ? parseInt(formData.releaseYear) : null
    };
    
    onSubmit(productData, images);
  };

  const categories = ['Men', 'Women', 'Unisex', 'Vintage', 'Limited Edition', 'Designer'];
  const conditions = ['New', 'Like New', 'Good', 'Fair'];
  const concentrations = ['Eau de Parfum', 'Eau de Toilette', 'Eau de Cologne', 'Parfum', 'Extrait'];
  const sizes = ['30ml', '50ml', '100ml', '150ml', '200ml'];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <FiInfo className="w-6 h-6 text-primary-500" />
          <h3 className="text-xl font-semibold text-primary-500">
            Basic Information
          </h3>
        </div>
        
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`glass-input w-full px-4 py-3 rounded-lg focus:outline-none ${
                errors.name ? 'border-red-500' : ''
              }`}
              placeholder="Enter product name"
              maxLength={100}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              Short Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`glass-input w-full px-4 py-3 rounded-lg focus:outline-none min-h-25 ${
                errors.description ? 'border-red-500' : ''
              }`}
              placeholder="Brief description (appears in product cards)"
              maxLength={200}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              Detailed Description *
            </label>
            <textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleChange}
              className="glass-input w-full px-4 py-3 rounded-lg focus:outline-none min-h-37.5"
              placeholder="Detailed product description, scent notes, etc."
              maxLength={1000}
            />
          </div>
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <FiDollarSign className="w-6 h-6 text-primary-500" />
          <h3 className="text-xl font-semibold text-primary-500">
            Pricing & Stock
          </h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Price */}
          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              Price ($) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500/70">
                $
              </span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`glass-input w-full pl-8 pr-4 py-3 rounded-lg focus:outline-none ${
                  errors.price ? 'border-red-500' : ''
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>

          {/* Original Price */}
          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              Original Price ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-500/70">
                $
              </span>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="glass-input w-full pl-8 pr-4 py-3 rounded-lg focus:outline-none"
                placeholder="Original price (for discount)"
              />
            </div>
            <p className="text-xs text-primary-500/60 mt-1">
              Leave empty if no discount
            </p>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="1"
              className={`glass-input w-full px-4 py-3 rounded-lg focus:outline-none ${
                errors.stock ? 'border-red-500' : ''
              }`}
              placeholder="1"
            />
            {errors.stock && (
              <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
            )}
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <FiPackage className="w-6 h-6 text-primary-500" />
          <h3 className="text-xl font-semibold text-primary-500">
            Product Details
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="glass-input w-full px-4 py-3 rounded-lg focus:outline-none appearance-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              Condition *
            </label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="glass-input w-full px-4 py-3 rounded-lg focus:outline-none appearance-none"
            >
              {conditions.map(condition => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              Size *
            </label>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="glass-input w-full px-4 py-3 rounded-lg focus:outline-none appearance-none"
            >
              {sizes.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Concentration */}
          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              Concentration
            </label>
            <select
              name="concentration"
              value={formData.concentration}
              onChange={handleChange}
              className="glass-input w-full px-4 py-3 rounded-lg focus:outline-none appearance-none"
            >
              {concentrations.map(conc => (
                <option key={conc} value={conc}>
                  {conc}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="glass-input w-full px-4 py-3 rounded-lg focus:outline-none"
              placeholder="e.g., Chanel, Dior, Creed"
            />
          </div>

          {/* Release Year */}
          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              Release Year
            </label>
            <select
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleChange}
              className="glass-input w-full px-4 py-3 rounded-lg focus:outline-none appearance-none"
            >
              <option value="">Select Year</option>
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-6">
          <label className="block text-primary-500 text-sm font-medium mb-2">
            Scent Notes (comma separated)
          </label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="glass-input w-full px-4 py-3 rounded-lg focus:outline-none"
            placeholder="e.g., Bergamot, Rose, Sandalwood, Vanilla"
          />
          <p className="text-xs text-primary-500/60 mt-1">
            Separate notes with commas
          </p>
        </div>
      </div>

      {/* Images */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <FiImage className="w-6 h-6 text-primary-500" />
          <h3 className="text-xl font-semibold text-primary-500">
            Product Images *
          </h3>
        </div>
        
        {errors.images && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
            {errors.images}
          </div>
        )}
        
        {/* Image Upload */}
        <div className="mb-6">
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-primary-300/50 rounded-xl cursor-pointer bg-primary-50/30 hover:bg-primary-50/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <FiUpload className="w-12 h-12 text-primary-500/60 mb-3" />
              <p className="mb-2 text-sm text-primary-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-primary-500/60">
                PNG, JPG, GIF up to 5MB (max 5 images)
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        
        {/* Image Previews */}
        {previewImages.length > 0 && (
          <div>
            <h4 className="font-medium text-primary-500 mb-4">
              Uploaded Images ({previewImages.length}/5)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {previewImages.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                    {index === 0 ? 'Main Image' : `Image ${index + 1}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 glass-card py-4 rounded-xl text-primary-500 font-semibold hover:bg-white/20 transition-colors"
        >
          Cancel
        </button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="flex-1 glass-button py-4 rounded-xl text-white font-semibold text-lg"
        >
          {product ? 'Update Product' : 'List Product for Sale'}
        </motion.button>
      </div>
    </form>
  );
};

export default ProductForm;