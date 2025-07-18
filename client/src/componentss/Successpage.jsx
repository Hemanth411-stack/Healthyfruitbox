import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiHome } from 'react-icons/fi';

const SuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { subscription } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-4">
      {/* Animated Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="relative mb-8"
      >
        <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center">
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              delay: 0.2
            }}
          >
            <FiCheck className="text-green-500 text-6xl" />
          </motion.div>
        </div>
        
        {/* Pulsing circle effect */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1.2, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0 border-4 border-green-200 rounded-full"
        />
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
        <p className="text-lg text-gray-600">
          Your subscription has been confirmed
        </p>
        {subscription?._id && (
          <p className="text-sm text-gray-500 mt-2">
            Order ID: {subscription._id}
          </p>
        )}
      </motion.div>

      {/* Countdown and Home Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <p className="text-gray-500 mb-4">
          Redirecting to homepage in 3 seconds...
        </p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center mx-auto px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-colors"
        >
          <FiHome className="mr-2" />
          Go Home Now
        </button>
      </motion.div>

      {/* Order Summary (if subscription data available) */}
      {/* {subscription && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 w-full max-w-md bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium">{subscription.productInfo?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Slot:</span>
              <span className="font-medium">{subscription.deliverySlot}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">{subscription.paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-100">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-bold text-green-600">₹{subscription.totalPrice}</span>
            </div>
          </div>
        </motion.div>
      )} */}
    </div>
  );
};

export default SuccessPage;