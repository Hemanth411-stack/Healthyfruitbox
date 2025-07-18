import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProducts, selectAllProducts, selectProductsStatus, selectProductsError } from '../redux/slices/product.js';
import { Link } from 'react-router-dom';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const [parent] = useAutoAnimate();
  const [hoveredProducts, setHoveredProducts] = useState({});

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getAllProducts());
    }
  }, [status, dispatch]);

  // Filter out products with "Large" or "Medium" in their names
  const filteredProducts = products.filter(product => 
    !product.name?.toLowerCase().includes('large') && 
    !product.name?.toLowerCase().includes('medium')
  );

  // Handle image slideshow for products with multiple images
  useEffect(() => {
    const intervals = {};
    
    filteredProducts.forEach(product => {
      if (product.images?.length > 1) {
        intervals[product._id] = setInterval(() => {
          setHoveredProducts(prev => ({
            ...prev,
            [product._id]: prev[product._id] === undefined ? 0 : (prev[product._id] + 1) % product.images.length
          }));
        }, 3000);
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [filteredProducts]);

  const handleProductHover = (productId, isHovering) => {
    if (isHovering) {
      setHoveredProducts(prev => ({ ...prev, [productId]: 0 }));
    } else {
      setHoveredProducts(prev => ({ ...prev, [productId]: undefined }));
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto mt-8" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <>
    
    <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header/>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Our Products</h1>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No products available</p>
        </div>
      ) : (
        <div 
          ref={parent}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {filteredProducts.map((product) => (
            <Link 
              key={product._id} 
              to={`/products/${product._id}`}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col group border border-gray-100 hover:border-blue-100"
              onMouseEnter={() => handleProductHover(product._id, true)}
              onMouseLeave={() => handleProductHover(product._id, false)}
            >
              <div className="p-4 flex-grow">
                <div className="h-60 bg-gray-50 flex items-center justify-center mb-4 relative overflow-hidden rounded-lg">
                  {product.images?.length > 0 ? (
                    <>
                      {product.images.map((image, index) => (
                        <img
                          key={image}
                          src={image}
                          alt={`${product.name} - ${index + 1}`}
                          className={`absolute inset-0 object-contain h-full w-full transition-opacity duration-500 ${
                            hoveredProducts[product._id] === index || 
                            (hoveredProducts[product._id] === undefined && index === 0) ? 
                            'opacity-100' : 'opacity-0'
                          }`}
                        />
                      ))}
                      {product.images.length > 1 && (
                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          +{product.images.length - 1} more
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-400">No image available</span>
                  )}
                </div>
                
                <div className="mb-3">
                  <h2 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h2>
                  {product.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                      {product.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${star <= (product.rating || 50) ? 'text-yellow-500 fill-current' : 'text-gray-200 fill-current'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                    <span className="text-gray-500 text-sm ml-1">({product.reviewCount || 100})</span>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  <span className="text-xl font-bold text-gray-900">
                    {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      {typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : product.originalPrice}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-green-600">In Stock</p>
                  <span className="text-xs text-gray-400">Free shipping</span>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-2xl text-center transition-all duration-300 flex items-center justify-center shadow-lg">
  <span>View Details</span>
  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
</button>

              </div>
            </Link>
          ))}
        </div>
      )}
     
    </div>
     <Footer/>
     </>
  );
};

export default ProductList;