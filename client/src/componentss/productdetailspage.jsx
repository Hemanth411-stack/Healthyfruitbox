import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiShoppingCart, FiCheck, FiChevronRight, FiStar, FiTruck, FiShield, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getProductById,
  clearCurrentProduct,
  resetProductStatus,
  selectCurrentProduct,
  selectProductsStatus,
  selectProductsError
} from '../redux/slices/product.js';
import { addToCart } from '../redux/slices/addtocart.js';
import Header from './Header.jsx';
import { selectCurrentUser } from '../redux/slices/Userslice.js';
import Footer from './Footer.jsx';
import { selectCartItems } from '../redux/slices/addtocart.js';

const MediumBoxDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  
  const product = useSelector(selectCurrentProduct);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const cartItems = useSelector(selectCartItems);
  
  // Safe defaults for product properties
  const images = product?.images || [];
  const features = product?.features || [];
  const testimonials = product?.testimonials || [];
  const addons = product?.addons || [];
  const description = product?.description || '';
  const price = product?.price || 0;
  const name = product?.name || '';
  const rating = product?.rating || 0;
  const reviewCount = product?.reviewCount || 0;

  const [selectedAddons, setSelectedAddons] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [isInCart, setIsInCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
    return () => {
      dispatch(clearCurrentProduct());
      dispatch(resetProductStatus());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const checkIfInCart = () => {
      if (!product || !cartItems || cartItems.length === 0) return false;
      
      const currentAddonPrices = selectedAddons.reduce((acc, addon) => {
        acc[addon.name] = addon.price;
        return acc;
      }, {});

      return cartItems.some(item => {
        if (item.productId !== id) return false;
        
        const itemAddonKeys = Object.keys(item.addOnPrices || {});
        const currentAddonKeys = Object.keys(currentAddonPrices);
        
        if (itemAddonKeys.length !== currentAddonKeys.length) return false;
        
        return itemAddonKeys.every(key => 
          item.addOnPrices[key] === currentAddonPrices[key]
        );
      });
    };

    setIsInCart(checkIfInCart());
  }, [cartItems, product, id, selectedAddons]);

  const toggleAddon = (addon) => {
    if (addon.name.toLowerCase().includes('egg')) {
      const eggPrice = name.toLowerCase().includes('medium') ? 299 : 399;
      const modifiedAddon = { 
        ...addon, 
        price: eggPrice,
        displayPrice: eggPrice
      };
      setSelectedAddons(prev => 
        prev.some(item => item.id === addon.id) 
          ? prev.filter(item => item.id !== addon.id) 
          : [modifiedAddon]
      );
    }
  };

  const calculateTotal = () => {
    const basePrice = price * quantity;
    const addonsPrice = selectedAddons.reduce((sum, addon) => sum + (addon.price * quantity), 0);
    return basePrice + addonsPrice;
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/products/${id}` } });
      return;
    }

    setIsAddingToCart(true);

    const cartItem = {
      productId: id,
      productType: /medium|large/i.test(name) ? 'fruitbox' : 'juice',
      quantity,
      basePrice: price,
      addOnPrices: selectedAddons.reduce((acc, addon) => {
        acc[addon.name] = addon.price;
        return acc;
      }, {}),
      notes: '',
      productInfo: {
        name,
        description,
        price,
        images,
        features
      }
    };

    try {
      await dispatch(addToCart(cartItem)).unwrap();
      showNotification('success', 'Product successfully added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      showNotification('error', 'Failed to add product to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Failed to load product</p>
          <p className="mt-2">{error}</p>
          <button 
            onClick={() => dispatch(getProductById(id))}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  const eggAddons = addons.filter(addon => addon.name.toLowerCase().includes('egg'));

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <Header/>
      
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification({ show: false, type: '', message: '' })}
            className="ml-4"
          >
            <FiX />
          </button>
        </motion.div>
      )}

      <div className="bg-white shadow-sm py-8">
        <div className="w-full px-6 py-3 border-b border-gray-100">
          <nav className="flex items-center text-sm max-w-7xl mx-auto">
            <Link to='/'><span className="text-gray-500 hover:text-gray-700 cursor-pointer">Home</span></Link>
            <FiChevronRight className="mx-2 text-gray-400" />
            <span className="text-gray-500 hover:text-gray-700 cursor-pointer">Fruit Boxes</span>
            <FiChevronRight className="mx-2 text-gray-400" />
            <span className="text-gray-700 font-medium">{name}</span>
          </nav>
        </div>
      </div>
      
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8 py-8">
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-xl overflow-hidden h-96 flex items-center justify-center">
                {images.length > 0 ? (
                  <motion.div
                    key={currentImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full"
                  >
                    <img
                      src={images[currentImage]}
                      alt={name}
                      className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-500"
                    />
                  </motion.div>
                ) : (
                  <img
                    src="/placeholder-product.jpg"
                    alt="Placeholder"
                    className="w-full h-full object-contain"
                  />
                )}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-3 h-3 rounded-full ${currentImage === index ? 'bg-green-500' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3 mt-4">
                  {images.map((img, index) => (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 ${currentImage === index ? 'border-green-500' : 'border-transparent'}`}
                    >
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full lg:w-1/2">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="sticky top-4"
              >
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={i < Math.floor(rating) ? 'fill-current' : ''} />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{rating} ({reviewCount} reviews)</span>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">₹{price.toLocaleString()}</span>
                    <span className="ml-2 text-gray-500">/ box</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-100 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-t border-b border-gray-300 bg-white">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-100 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                {description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Description</h3>
                    <p className="text-gray-700 leading-relaxed">{description}</p>
                  </div>
                )}

                {eggAddons.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Add-ons:</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {eggAddons.map((addon) => {
                        const eggPrice = name.toLowerCase().includes('medium') ? 299 : 399;
                        return (
                          <motion.div
                            whileHover={{ y: -2 }}
                            key={addon.id}
                            onClick={() => toggleAddon(addon)}
                            className={`p-4 rounded-lg cursor-pointer transition-all ${selectedAddons.some(item => item.id === addon.id)
                              ? 'bg-green-50 border-2 border-green-400 shadow-sm'
                              : 'bg-gray-50 border border-gray-200 hover:border-gray-300'}`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium text-gray-900">{addon.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">{addon.description}</p>
                              </div>
                              <div className="text-right">
                                <span className="font-medium text-gray-900">
                                  +₹{eggPrice}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{name} × {quantity}</span>
                      <span className="font-medium">₹{(price * quantity).toLocaleString()}</span>
                    </div>
                    {selectedAddons.map(addon => (
                      <div key={addon.id} className="flex justify-between">
                        <span className="text-gray-600">{addon.name} × {quantity}</span>
                        <span className="font-medium">+₹{(addon.price * quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-3 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-green-600">₹{calculateTotal().toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: isInCart || isAddingToCart ? 1 : 1.02 }}
                  whileTap={{ scale: isInCart || isAddingToCart ? 1 : 0.98 }}
                  onClick={isInCart ? () => navigate('/cart') : handleAddToCart}
                  disabled={isAddingToCart}
                  className={`w-full ${
                    isInCart 
                      ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500'
                      : isAddingToCart
                        ? 'bg-indigo-400 text-white'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white'
                  } font-bold py-4 px-6 rounded-2xl shadow-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden`}
                >
                  {isAddingToCart ? (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                      </div>
                      <span className="opacity-0">Adding to Cart</span>
                    </>
                  ) : isInCart ? (
                    <>
                      <FiCheck className="mr-3" />
                      <span className="text-lg">Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <FiShoppingCart className="mr-3" />
                      <span className="text-lg">Add to Cart</span>
                    </>
                  )}
                </motion.button>

                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiTruck className="text-green-500 mr-2" />
                    <span>Free Delivery</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiShield className="text-green-500 mr-2" />
                    <span>Quality Guarantee</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Product</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {description}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Why You'll Love It:</h3>
                <ul className="space-y-3">
                  {features.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="bg-green-100 p-1 rounded-full mr-3">
                        <FiCheck className="text-green-500 text-sm" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {testimonials.length > 0 && (
        <div className="w-full bg-white py-12 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Customer Reviews</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  whileHover={{ y: -5 }}
                  key={index}
                  className="bg-gray-50 p-6 rounded-xl border border-gray-200"
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={`${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                  <p className="font-medium text-gray-900">— {testimonial.author}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MediumBoxDetails;