import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiHome, FiGlobe } from 'react-icons/fi';

const ShippingForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    address: initialData.address || '',
    city: initialData.city || '',
    state: initialData.state || '',
    postalCode: initialData.postalCode || '',
    country: initialData.country || 'US'
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-card rounded-xl p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-primary-500 mb-2">
            Shipping Address
          </h3>
          <p className="text-primary-500/60">
            Where should we deliver your order?
          </p>
        </div>

        {/* Name Fields */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              First Name *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FiUser className="w-5 h-5 text-primary-500/50" />
              </div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`glass-input w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
                placeholder="John"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              Last Name *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FiUser className="w-5 h-5 text-primary-500/50" />
              </div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`glass-input w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
                placeholder="Doe"
              />
            </div>
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FiMail className="w-5 h-5 text-primary-500/50" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`glass-input w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none ${
                  errors.email ? 'border-red-500' : ''
                }`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FiPhone className="w-5 h-5 text-primary-500/50" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`glass-input w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none ${
                  errors.phone ? 'border-red-500' : ''
                }`}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-primary-500 text-sm font-medium mb-2">
            Street Address *
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <FiHome className="w-5 h-5 text-primary-500/50" />
            </div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`glass-input w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none ${
                errors.address ? 'border-red-500' : ''
              }`}
              placeholder="123 Main Street"
            />
          </div>
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address}</p>
          )}
        </div>

        {/* City, State, Postal Code */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              City *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FiMapPin className="w-5 h-5 text-primary-500/50" />
              </div>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`glass-input w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none ${
                  errors.city ? 'border-red-500' : ''
                }`}
                placeholder="New York"
              />
            </div>
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              State *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FiMapPin className="w-5 h-5 text-primary-500/50" />
              </div>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`glass-input w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none ${
                  errors.state ? 'border-red-500' : ''
                }`}
                placeholder="NY"
              />
            </div>
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">{errors.state}</p>
            )}
          </div>

          <div>
            <label className="block text-primary-500 text-sm font-medium mb-2">
              Postal Code *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <FiMapPin className="w-5 h-5 text-primary-500/50" />
              </div>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className={`glass-input w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none ${
                  errors.postalCode ? 'border-red-500' : ''
                }`}
                placeholder="10001"
              />
            </div>
            {errors.postalCode && (
              <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
            )}
          </div>
        </div>

        {/* Country */}
        <div className="mb-6">
          <label className="block text-primary-500 text-sm font-medium mb-2">
            Country
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <FiGlobe className="w-5 h-5 text-primary-500/50" />
            </div>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="glass-input w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none appearance-none"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="JP">Japan</option>
              <option value="IN">India</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 glass-card py-3 rounded-lg text-primary-500 font-medium hover:bg-white/20 transition-colors"
          >
            Back to Cart
          </button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex-1 glass-button py-3 rounded-lg text-white font-semibold"
          >
            Continue to Payment
          </motion.button>
        </div>
      </div>
    </form>
  );
};

export default ShippingForm;