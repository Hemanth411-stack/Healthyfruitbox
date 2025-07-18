import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import {
  fetchUserSubscriptions,
  fetchUserSubscriptionStats,
  selectSubscriptions,
  selectSubscriptionStats,
  selectSubscriptionStatus,
  selectSubscriptionStatsStatus,
  selectSubscriptionError,
} from "../redux/slices/Subscription.js";
import { Link } from "react-router-dom";
import Footer from "./Footer";

export const SubscriptionDashboard = () => {
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);
  const dispatch = useDispatch();
  
  // Select data from Redux store
  const subscriptionData = useSelector(selectSubscriptions);
  const subscriptions = subscriptionData?.subscriptions || [];
  const stats = useSelector(selectSubscriptionStats);
  const status = useSelector(selectSubscriptionStatus);
  const statsStatus = useSelector(selectSubscriptionStatsStatus);
  const error = useSelector(selectSubscriptionError);
  const hasActive = subscriptions.some(sub => sub?.status === 'active');

  // Calculate total subscriptions count
  const totalSubscriptions = subscriptions?.length || 0;
  console.log("data",subscriptions)
  useEffect(() => {
    dispatch(fetchUserSubscriptions());
    dispatch(fetchUserSubscriptionStats());
  }, [dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDaysLeft = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusStyles = (status) => {
    if (!status || typeof status !== 'string') {
      return { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-400' };
    }

    switch (status.toLowerCase()) {
      case 'active':
        return { 
          bg: 'bg-emerald-50', 
          text: 'text-emerald-800', 
          dot: 'bg-emerald-500',
          border: 'border-emerald-200'
        };
      case 'pending':
        return { 
          bg: 'bg-amber-50', 
          text: 'text-amber-800', 
          dot: 'bg-amber-500',
          border: 'border-amber-200'
        };
      case 'cancelled':
        return { 
          bg: 'bg-rose-50', 
          text: 'text-rose-800', 
          dot: 'bg-rose-500',
          border: 'border-rose-200'
        };
      default:
        return { 
          bg: 'bg-gray-50', 
          text: 'text-gray-800', 
          dot: 'bg-gray-500',
          border: 'border-gray-200'
        };
    }
  };

  const toggleExpandCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Loading state
  if (status === 'loading' || statsStatus === 'loading') {
    return (
      <div className="font-sans min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'failed' || statsStatus === 'failed') {
    return (
      <div className="font-sans min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <Header />
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 border border-rose-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Error loading subscription data</h3>
              <div className="mt-2 text-sm text-gray-600">
                <p>{error || 'Failed to load subscription data. Please try again later.'}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => {
                    dispatch(fetchUserSubscriptions());
                    dispatch(fetchUserSubscriptionStats());
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No subscription found
  if (totalSubscriptions === 0) {
    return (
      <div className="font-sans min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <Header />
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 mb-6">
              <svg className="h-12 w-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Active Subscriptions
            </h2>
            <p className="text-gray-600 mb-8">
              You don't have any active subscriptions yet. Explore our plans to get started!
            </p>
            <Link to='/'>
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:-translate-y-1">
                Browse Subscription Plans
                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <Header />

      <div className="flex-1 pt-16 px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pt-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                My Subscriptions
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Manage your active subscriptions and deliveries
              </p>
            </div>
            
            {hasActive && (
              <div className="flex gap-3 w-full md:w-auto">
                <Link to="/deliveries">
                  <button className="inline-flex items-center px-5 py-3 border border-gray-200 shadow-sm text-base font-medium rounded-full bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:-translate-y-0.5">
                    <svg className="-ml-1 mr-3 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-2a1 1 0 00-.293-.707l-3-3A1 1 0 0016 7h-1V5a1 1 0 00-1-1H3z" />
                    </svg>
                    View My Deliveries
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Welcome Banner */}
          {showWelcomeMessage && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm p-6 mb-8 border border-blue-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-blue-200 opacity-20"></div>
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-indigo-200 opacity-20"></div>
              <div className="relative z-10 flex justify-between items-start">
                <div className="max-w-2xl">
                  <h1 className="text-xl font-semibold text-gray-900 mb-3">
                    Welcome to Your Subscription Dashboard
                  </h1>
                  <p className="text-gray-700">
                    You have <span className="font-bold text-blue-600">{totalSubscriptions}</span> {totalSubscriptions === 1 ? 'subscription' : 'subscriptions'}. 
                    Manage your services, view upcoming deliveries, and track payments all in one place.
                  </p>
                </div>
                <button
                  onClick={() => setShowWelcomeMessage(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Subscription Cards Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Fruit Box Subscriptions</h2>
                <p className="text-gray-600 mt-1">Fresh deliveries straight to your doorstep</p>
              </div>
              {hasActive && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                  {subscriptions.filter(sub => sub.status === 'active').length} active 
                  {subscriptions.filter(sub => sub.status === 'active').length === 1 ? ' subscription' : ' subscriptions'}
                </span>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
              {subscriptions.map((subscription) => {
                const statusStyles = getStatusStyles(subscription.status);
                const daysLeft = calculateDaysLeft(subscription.startDate, subscription.endDate);
                const isExpanded = expandedCard === subscription._id;
                const isExpiringSoon = daysLeft <= 7;

                return (
                  <div 
                    key={subscription._id} 
                    className={`bg-white rounded-xl shadow-sm overflow-hidden border ${statusStyles.border} transition-all duration-200 hover:shadow-md`}
                  >
                    {/* Card Header */}
                    <div 
                      className={`p-6 cursor-pointer ${statusStyles.bg} rounded-t-xl`}
                      onClick={() => toggleExpandCard(subscription._id)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-start space-x-4">
                          {/* Fruit Icon with Status Badge */}
                          <div className="relative">
                            <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${statusStyles.bg.replace('50', '100')} shadow-inner`}>
                              <svg className="h-7 w-7 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                            </div>
                            {isExpiringSoon && (
                              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform rotate-3 bg-gradient-to-r from-rose-500 to-rose-600 rounded-full shadow-sm">
                                {daysLeft}d
                              </span>
                            )}
                          </div>

                          {/* Subscription Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-baseline gap-2">
                              <h3 className="text-lg font-bold text-gray-900">
                                {subscription.products.length > 0 
                                  ? subscription.products.map(p => {
                                      // Handle different product types
                                      let displayName = '';
                                      if (p.productType === 'fruitbox') {
                                        displayName = p.product.name;
                                      } else if (p.productType === 'juice') {
                                        displayName = p.product.name;
                                      } else {
                                        displayName = p.productType || 'Premium Item';
                                      }
                                      
                                      // Add quantity if more than 1
                                      return `${p.quantity > 1 ? p.quantity + '× ' : ''}${displayName}`;
                                    }).join(' + ')
                                  : 'Your Subscription'
                                }
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles.text} ${statusStyles.bg.replace('50', '100')} shadow-sm`}>
                                <span className={`w-2 h-2 rounded-full ${statusStyles.dot} mr-1.5`}></span>
                                {subscription.status?.charAt(0).toUpperCase() + subscription.status?.slice(1)}
                              </span>
                            </div>
                            
                            {/* Add-ons information */}
                            {subscription.products.some(p => p.addOnPrices && Object.keys(p.addOnPrices).length > 0) && (
                              <div className="mt-1 text-sm text-gray-600">
                                <span className="font-medium">Add-ons:</span> 
                                {subscription.products.flatMap(p => 
                                  p.addOnPrices 
                                    ? Object.entries(p.addOnPrices).map(([addOn, price]) => (
                                        <span key={addOn} className="ml-2">
                                          {addOn} (+₹{price})
                                        </span>
                                      ))
                                    : []
                                )}
                              </div>
                            )}

                            {/* Delivery notes */}
                            {subscription.notes && (
                              <div className="mt-1 text-sm text-gray-600">
                                <span className="font-medium">Note:</span> {subscription.notes}
                              </div>
                            )}

                            {/* Progress Bar */}
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                <span>Started: {formatDate(subscription.startDate)}</span>
                                <span>Ends: {formatDate(subscription.endDate)}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${isExpiringSoon ? 'bg-gradient-to-r from-amber-400 to-rose-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`}
                                  style={{ width: `${Math.min(100, Math.max(0, (daysLeft / 30) * 100))}%` }}
                                ></div>
                              </div>
                              <div className="mt-1 flex justify-between items-center">
                                <div className="flex items-center text-sm">
                                  <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className={isExpiringSoon ? 'font-medium text-rose-600' : 'text-gray-600'}>
                                    {daysLeft > 0 ? daysLeft : 0} days remaining
                                  </span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-xs font-medium text-gray-500 mr-2">
                                    ₹{subscription.totalPrice}
                                  </span>
                                  <span className="text-xs font-medium text-gray-500">
                                    #{subscriptions.indexOf(subscription) + 1}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expand/Collapse Icon */}
                        <div className="flex-shrink-0">
                          <svg
                            className={`h-6 w-6 text-gray-500 transition-transform duration-200 ${isExpanded ? 'transform rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Content */}
                    {isExpanded && (
                      <div className="p-6 border-t border-gray-200">
                        <div className="grid md:grid-cols-3 gap-8">
                          {/* Subscription Details */}
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                Box Contents
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                  Seasonal Fruits
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Organic Produce
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                  Exotic Varieties
                                </span>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                Delivery Details
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Frequency</span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {subscription.billingCycle === 'weekly' ? 'Weekly' : 'Monthly'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Payment & Status */}
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                Payment Information
                              </h4>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Amount</span>
                                  <span className="text-lg font-bold text-emerald-600">
                                    ₹{subscription.totalPrice?.toLocaleString() || '0'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Method</span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {subscription.paymentMethod === "COD" ? "Cash on Delivery" : subscription.paymentMethod}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Status</span>
                                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    subscription.paymentStatus === 'paid'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {subscription.paymentStatus?.charAt(0).toUpperCase() + subscription.paymentStatus?.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SubscriptionDashboard;