import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartTotalPrice,
  selectCartLoading,
  selectCartError,
  getCart,
  updateCartQuantity,
  removeItemFromCart
} from '../redux/slices/addtocart.js';
import Header from "../componentss/Header.jsx";
import { Link } from 'react-router-dom';

const CartPage = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  const handleQuantityChange = async (product, productType, newQuantity) => {
    if (newQuantity > 0) {
      setLocalLoading(true);
      try {
        await dispatch(updateCartQuantity({
          productId: product._id,
          productType,
          quantity: newQuantity
        })).unwrap();
        
        // Refresh the cart to ensure we have latest data
        await dispatch(getCart());
      } catch (error) {
        console.error('Failed to update quantity:', error);
      } finally {
        setLocalLoading(false);
      }
    }
  };

  const handleRemoveItem = async (productId, productType) => {
    setLocalLoading(true);
    try {
      await dispatch(removeItemFromCart({ productId, productType })).unwrap();
      await dispatch(getCart());
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">Error loading cart: {error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Header/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
          {items.length > 0 && (
            <span className="ml-4 bg-gray-100 text-gray-800 text-sm font-medium px-2.5 py-0.5 rounded">
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </span>
          )}
        </div>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="mt-4 text-xl font-medium text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">Start adding some amazing products to your cart!</p>
            <div className="mt-6">
              <Link
                to="/products"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Section */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Cart Items</h2>
                </div>
                
                <ul className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={`{item.product._id}-{item.productType}`} className="p-6">
                      <div className="flex flex-col sm:flex-row">
                        {/* <div className="sm:w-1/4 mb-4 sm:mb-0 flex-shrink-0">
                          <img
                            src={item.product.images?.[0] || '/placeholder-product.jpg'}
                            alt={item.product.name}
                            className="w-full h-40 object-contain"
                            onError={(e) => {
                              e.target.src = '/placeholder-product.jpg';
                            }}
                          />
                        </div> */}
                        
                        <div className="sm:w-3/4 sm:pl-6">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {item.product.name}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                {item.product.description?.substring(0, 100)}...
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                {item.basePrice?.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex items-center">
                            <label htmlFor={`quantity-{item.product._id}`} className="mr-2 text-sm font-medium text-gray-700">
                              Quantity:
                            </label>
                            <select
                              id={`quantity-{item.product._id}`}
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.product, item.productType, parseInt(e.target.value))}
                              className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                              disabled={localLoading}
                            >
                              {[...Array(10).keys()].map((num) => (
                                <option key={num + 1} value={num + 1}>
                                  {num + 1}
                                </option>
                              ))}
                            </select>
                            
                            <button
                              onClick={() => handleRemoveItem(item.product._id, item.productType)}
                              className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                              disabled={localLoading}
                            >
                              <svg className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {totalPrice?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Order Summary Section */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-4">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                </div>
                
                <div className="px-6 py-4 space-y-4">
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-sm font-medium text-gray-900">
                      {totalPrice?.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Shipping</p>
                    <p className="text-sm font-medium text-green-600">FREE</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Tax</p>
                    <p className="text-sm font-medium text-gray-900">Calculated at checkout</p>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between">
                      <p className="text-base font-medium text-gray-900">Total</p>
                      <p className="text-base font-bold text-gray-900">
                        {totalPrice?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50">
                  <Link to={'/checkout'}>
                    <button
                      className="w-full bg-blue-600 hover:bg-blue-700 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      disabled={localLoading || items.length === 0}
                    >
                      {localLoading ? 'Processing...' : 'Proceed to Checkout'}
                    </button>
                  </Link>
                  <p className="mt-3 text-xs text-gray-500 text-center">
                    By placing your order, you agree to our{' '}
                    <a href="/terms" className="text-blue-600 hover:text-blue-800">Terms of Service</a> and{' '}
                    <a href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;