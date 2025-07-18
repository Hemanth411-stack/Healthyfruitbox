import React, { useEffect, useState } from 'react';
import {
  Clock,
  Check,
  X,
  ChevronDown,
  Package,
  Calendar,
  Filter,
  MapPin,
  Info
} from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDeliveries } from '../redux/slices/delivery.js';
import { selectSubscriptions } from "../redux/slices/Subscription.js";
import Header from './Header.jsx';
import Footer from "./Footer.jsx";

const MyDeliveries = () => {
  const dispatch = useDispatch();
  const { deliveries: reduxDeliveries = [], loading, error } = useSelector(
    (state) => state.delivery
  );
  const subscriptionData = useSelector(selectSubscriptions);
  const subscriptions = subscriptionData?.subscriptions || [];

  // Local state for UI
  const [filter, setFilter] = useState('all');
  const [expandedDelivery, setExpandedDelivery] = useState(null);

  useEffect(() => {
    dispatch(getUserDeliveries());
  }, [dispatch]);

  // Function to check if a date is today
  const isToday = (dateString) => {
    try {
      const deliveryDate = new Date(dateString);
      const today = new Date();

      return (
        deliveryDate.getDate() === today.getDate() &&
        deliveryDate.getMonth() === today.getMonth() &&
        deliveryDate.getFullYear() === today.getFullYear()
      );
    } catch (e) {
      return false;
    }
  };

  // Function to get subscription details
  const getSubscriptionDetails = (delivery) => {
    // First try to get details from the delivery itself
    if (delivery.subscriptionDetails) {
      return {
        name: delivery.subscriptionDetails.name || 'Custom Box',
        price: delivery.subscriptionDetails.price || '₹0',
        items: delivery.subscriptionDetails.items || 0
      };
    }

    // Fallback to subscription data if available
    if (subscriptions && subscriptions.length > 0) {
      const activeSubscription = subscriptions.find(sub => sub.isActive);
      if (activeSubscription) {
        return {
          name: activeSubscription.name || 'Custom Box',
          price: `₹${activeSubscription.price}`,
          items: activeSubscription.contents
            ? Object.values(activeSubscription.contents).reduce((sum, quantity) => sum + quantity, 0)
            : 12
        };
      }
    }

    // Default values
    return {
      name: delivery.isFestivalOrSunday ? 'Festival Special Box' : 'Fruit Box',
      price: delivery.isFestivalOrSunday ? '₹59.99' : '₹49.99',
      items: delivery.isFestivalOrSunday ? 15 : 12
    };
  };

  // Safely transform Redux deliveries to match the expected format and filter for today's date
  const todaysDeliveries = Array.isArray(reduxDeliveries)
    ? reduxDeliveries
        .filter(delivery => isToday(delivery.deliveryDate))
        .map(delivery => {
          const subscriptionDetails = getSubscriptionDetails(delivery);
          return {
            id: delivery._id || Math.random().toString(36).substr(2, 9),
            name: subscriptionDetails.name,
            date: delivery.deliveryDate || new Date().toISOString(),
            status: delivery.status || 'pending',
            items: subscriptionDetails.items,
            price: subscriptionDetails.price,
            deliveryWindow: delivery.slot === 'morning 6Am - 8Am' ? '6:00 AM - 8:00 AM' : '8:00 AM - 10:00 AM',
            address: delivery.address || {
              street: delivery.street || '',
              area: delivery.area || '',
              city: delivery.city || '',
              state: delivery.state || '',
              pincode: delivery.pincode || ''
            },
            notes: delivery.notes || '',
            isFestivalOrSunday: delivery.isFestivalOrSunday || false
          };
        })
    : [];

  // Filter deliveries based on status
  const filteredDeliveries = filter === 'all'
    ? todaysDeliveries
    : todaysDeliveries.filter(delivery => delivery.status === filter);

  // Get status color and icon
  const getStatusStyles = (status) => {
    switch(status) {
      case 'pending':
        return {
          bgColor: 'bg-amber-50',
          textColor: 'text-amber-800',
          icon: <Clock className="h-5 w-5 text-amber-500" />,
          label: 'Pending'
        };
      case 'delivered':
        return {
          bgColor: 'bg-emerald-50',
          textColor: 'text-emerald-800',
          icon: <Check className="h-5 w-5 text-emerald-500" />,
          label: 'Delivered'
        };
      case 'missed':
        return {
          bgColor: 'bg-rose-50',
          textColor: 'text-rose-800',
          icon: <X className="h-5 w-5 text-rose-500" />,
          label: 'Missed'
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
          icon: <Info className="h-5 w-5 text-gray-500" />,
          label: 'Unknown'
        };
    }
  };

  const toggleDeliveryExpansion = (id) => {
    setExpandedDelivery(expandedDelivery === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <X className="h-5 w-5 text-red-500 mr-3" />
              <p className="text-red-700">Error loading deliveries: {error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-20 max-w-6xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Today's Deliveries</h1>
          <p className="text-gray-600 mt-2">View and manage your scheduled deliveries</p>
        </div>

        {/* Filter controls */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-gray-500">
            Showing {filteredDeliveries.length} {filter === 'all' ? 'deliveries' : filter}
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Deliveries</option>
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="missed">Missed</option>
            </select>
          </div>
        </div>

        {/* Delivery cards */}
        <div className="space-y-4">
          {filteredDeliveries.length > 0 ? (
            filteredDeliveries.map((delivery) => {
              const status = getStatusStyles(delivery.status);
              const isExpanded = expandedDelivery === delivery.id;

              return (
                <div
                  key={delivery.id}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 ${
                    isExpanded ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-md'
                  }`}
                >
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => toggleDeliveryExpansion(delivery.id)}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${status.bgColor} ${status.textColor}`}>
                          <Package className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{delivery.name}</h3>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Today • {delivery.deliveryWindow}</span>
                          </div>
                          <div className="md:hidden mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
                              {status.icon}
                              <span className="ml-1.5">{status.label}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="hidden md:flex items-center gap-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.bgColor} ${status.textColor}`}>
                          {status.icon}
                          <span className="ml-2">{status.label}</span>
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-500 flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            Delivery Address
                          </h4>
                          <address className="text-gray-700 not-italic space-y-1.5">
                            {delivery.address.street && <p className="text-base">{delivery.address.street}</p>}
                            {delivery.address.area && <p className="text-base">{delivery.address.area}</p>}
                            <p className="text-base">
                              {delivery.address.city && `${delivery.address.city}, `}
                              {delivery.address.state && `${delivery.address.state} `}
                              {delivery.address.pincode}
                            </p>
                          </address>
                        </div>
                        
                        {/* <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-500 flex items-center">
                            <Info className="h-4 w-4 mr-2" />
                            Delivery Details
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500">Items</p>
                              <p className="text-base font-medium">{delivery.items}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Price</p>
                              <p className="text-base font-medium">{delivery.price}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Type</p>
                              <p className="text-base font-medium">
                                {delivery.isFestivalOrSunday ? 'Festival/Sunday' : 'Regular'}
                              </p>
                            </div>
                          </div>
                        </div> */}
                      </div>
                      
                      {/* <div className="mt-6 flex justify-end space-x-3">
                        <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                          Contact Support
                        </button>
                        <button className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-700 transition-colors">
                          View Receipt
                        </button>
                      </div> */}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
              <div className="mx-auto h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No deliveries today</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {filter === 'all'
                  ? "You don't have any deliveries scheduled for today."
                  : `You don't have any ${filter} deliveries.`}
              </p>
              <button className="mt-6 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Schedule a Delivery
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyDeliveries;