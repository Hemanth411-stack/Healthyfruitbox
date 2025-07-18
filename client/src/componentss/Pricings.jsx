import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts, selectAllProducts, selectProductsStatus } from '../redux/slices/product.js';
import { motion } from 'framer-motion';

const FruitBoxPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  console.log("products names",products)
  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  const commonFeatures = [
    "Fresh seasonal fruits",
    "Organic vegetables",
    "Daily farm eggs",
    "Free doorstep delivery",
    "Flexible scheduling",
    "Cancel anytime"
  ];

  if (status === 'loading') {
    return (
      <section className="py-16 bg-white" id='plans'>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">
                Fresh Fruit Box Plans
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Loading our delicious offerings...
            </p>
          </div>
          <div className="flex justify-center gap-8">
            {[1, 2].map((item) => (
              <div key={item} className="bg-gray-100 rounded-2xl p-6 w-96 h-[500px] animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (status === 'failed') {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">We couldn't load our fruit box plans. Please try again.</p>
          <button 
            onClick={() => dispatch(getAllProducts())}
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🍃</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No Plans Available</h3>
          <p className="text-gray-600">Check back soon for our fresh fruit box offerings!</p>
        </div>
      </section>
    );
  }

const fruitBoxProducts = products.filter(product => product.name === 'Medium' || product.name === "Large");
  console.log("fruitboxproducts",fruitBoxProducts)
  console.log("products",products)
  return (
    <section className="py-16 bg-white" id='plans'>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 mb-3"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">
              Fresh Fruit Box Plans
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Choose the perfect box of farm-fresh goodness delivered to your door
          </motion.p>
        </div>

        {/* Centered Plans Container */}
        <div className="flex flex-col items-center md:flex-row md:justify-center gap-8">
          {fruitBoxProducts.map((product, index) => (
            <motion.div 
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`relative w-full max-w-md rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                selectedPlan === index ? 'ring-4 ring-green-300' : 'hover:shadow-xl'
              } ${
                product.popular ? 'border-2 border-yellow-300' : 'border border-gray-200'
              }`}
            >
              {product.popular && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                  className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md z-10"
                >
                  Most Popular
                </motion.div>
              )}

              <div className="h-48 bg-gradient-to-r from-green-100 to-blue-100 flex items-center justify-center">
                <motion.img 
                  src={product.image || 'https://www.shutterstock.com/image-photo/fresh-fruits-wooden-box-260nw-285103652.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <div className="p-6 bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                    <p className="text-gray-500 text-sm">{product.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
                    <span className="text-gray-500 text-sm block">Per Month</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">What's inside:</h4>
                  <ul className="space-y-2">
                    {product.keyPoints?.map((point, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-start"
                        whileHover={{ x: 5 }}
                      >
                        <svg className="flex-shrink-0 h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6 bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">All plans include:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {commonFeatures.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <svg className="flex-shrink-0 h-4 w-4 text-green-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-300 ${
                    selectedPlan === index
                      ? 'bg-green-600 text-white'
                      : product.popular
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
                        : 'bg-gradient-to-r from-green-500 to-blue-600 text-white'
                  }`}
                  onClick={() => {
                    setSelectedPlan(index);
                    navigate(`/products/${product._id}`);
                  }}
                >
                  {selectedPlan === index ? 'Selected ✓' : 'Select Plan'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center bg-gray-50 rounded-full px-6 py-3">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-gray-600">Need help choosing the right box?</span>
            <button className="ml-3 text-green-600 font-medium hover:text-green-700">
              Contact us →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};



export default FruitBoxPlans;