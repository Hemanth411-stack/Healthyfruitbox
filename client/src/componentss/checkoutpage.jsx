import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchUserInfo,
  updateUserInfo,
  selectUserInfo,
  selectUserInfoStatus,
  selectUserInfoSaveStatus,
} from '../redux/slices/Userinformation.js';
import Header from "../componentss/Header.jsx"
import Footer from "../componentss/Footer.jsx"
import {
  createSubscription,
  selectSubscriptionOperationStatus,
  resetSubscriptionStatus,
} from '../redux/slices/Subscription.js';
import {
  selectCartItems,
  selectCartTotalPrice,
  getCart,
  clearCartState,
} from '../redux/slices/addtocart.js';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAP_API_KEY = "AIzaSyAMPrwC9ii-4QvIRA_75CbxSp-6keDC6aM";

const containerStyle = {
  width: "100%",
  height: "300px",
  marginTop: "20px",
  border: "1px solid #ccc",
  borderRadius: "8px",
};

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Selectors
  const userInfo = useSelector(selectUserInfo);
  const userInfoStatus = useSelector(selectUserInfoStatus);
  const userInfoSaveStatus = useSelector(selectUserInfoSaveStatus);
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const subscriptionStatus = useSelector(selectSubscriptionOperationStatus);

  // State
  const [startDate, setStartDate] = useState(new Date());
  const [deliverySlot, setDeliverySlot] = useState('6-8AM');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [paymentProof, setPaymentProof] = useState('');
  const [notes, setNotes] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    type: 'Home'
  });
  const [coords, setCoords] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
    libraries: ["places"],
  });
  const areas = [
  "Ameerpet", "Allapur",
  "Balkampet", "Banjara Hills", "Begumpet", "Borabanda",
  "Chandanagar", "Chinthal",
  "DLF Surroundings",
  "Film Nagar",
  "Gachibowli", "Gajularamaram", "Gowli Doddi",
  "Hafeezpet", "Hitech City",
  "IDPL Balanagar",
  "JNTU Surroundings", "Jagadgiri Gutta", "Jeedimetla", "Jubilee Hills",
  "Khajaguda", "Kondapur", "Kukatpally", "Kukatpally All Phases", "KPHB All Phases",
  "Madhapur", "Madhura Nagar", "Manikonda", "Miyapur", "Moosa Pet",
  "Nallagandla", "Narsingi", "Nanakramguda", "Nizampet",
  "Panjagutta", "Pragathi Nagar", "Prakash Nagar",
  "Raidurg",
  "Sanath Nagar", "Shaikpet", "Somajiguda", "SR Nagar", "Sri Nagar Colony",
  "Toli Chowki",
  "Wipro Circle",
  "Yousaf guda"
];
  // Fetch user info and cart on mount
  useEffect(() => {
    dispatch(fetchUserInfo());
    dispatch(getCart());
  }, [dispatch]);

  // Handle subscription creation success
  useEffect(() => {
    if (subscriptionStatus === 'succeeded') {
      setCheckoutSuccess(true);
      dispatch(clearCartState());
      
      const timer = setTimeout(() => {
        dispatch(resetSubscriptionStatus());
        navigate('/subscriptionpage');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [subscriptionStatus, dispatch, navigate]);

  // Form validation schema
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
      .required('Phone number is required'),
  });

 const getCurrentLocation = async () => {
  setLocationLoading(true);
  
  try {
    if (navigator.geolocation) {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const newCoords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      setCoords(newCoords);

      try {
        const LOCATIONIQ_TOKEN = "pk.2facabff1fbb7c3da67ac5b80179b3e3";
        const response = await fetch(
          `https://us1.locationiq.com/v1/reverse.php?key=${LOCATIONIQ_TOKEN}&lat=${newCoords.lat}&lon=${newCoords.lng}&format=json`
        );
        const data = await response.json();
        
        if (data.address) {
          const addr = data.address;
          setAddressFormData(prev => ({
            ...prev,
            street: addr.road || addr.pedestrian || addr.footway || '',
            // Don't update area from geolocation - keep selected dropdown value
            city: addr.city || addr.town || addr.village || addr.county || '',
            state: addr.state || addr.region || '',
            pincode: addr.postcode || '',
          }));
        }
      } catch (geocodeError) {
        console.error("Geocoding error:", geocodeError);
        toast.info("Got your location but couldn't fetch full address details");
      }

      return newCoords;
    } else {
      throw new Error("Geolocation is not supported by this browser.");
    }
  } catch (error) {
    console.error("Location error:", error);
    toast.error("Couldn't get precise location. Please try manual selection.");
    return null;
  } finally {
    setLocationLoading(false);
  }
};


  const handleMapClick = (e) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    setCoords({ lat: newLat, lng: newLng });
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveAddress = async () => {
    if (!addressFormData.street || !addressFormData.area || !addressFormData.city || 
        !addressFormData.state || !addressFormData.pincode) {
      toast.error('Please fill all address fields');
      return;
    }

    let googleMapsLink = "";
    if (coords) {
      googleMapsLink = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
    } else {
      const addressString = `${addressFormData.street}, ${addressFormData.area}, ${addressFormData.city}, ${addressFormData.state} ${addressFormData.pincode}`;
      googleMapsLink = `https://www.google.com/maps?q=${encodeURIComponent(addressString)}`;
    }

    const addressData = {
      street: addressFormData.street,
      area: addressFormData.area,
      city: addressFormData.city,
      state: addressFormData.state,
      pincode: addressFormData.pincode,
      type: addressFormData.type,
      googleMapLink: googleMapsLink,
    };
    
    setSelectedAddress(addressData);
    setShowAddressForm(false);
    toast.success('Address selected successfully!');
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (!selectedAddress) {
        toast.error('Please select a delivery address');
        setSubmitting(false);
        return;
      }

      // Update user info with all details
      const updateResponse = await dispatch(updateUserInfo({
        userId: userInfo._id,
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        address: {
          ...selectedAddress,
          deliverySlot
        }
      }));

      if (updateUserInfo.rejected.match(updateResponse)) {
        throw new Error('Failed to update user information');
      }

      // Prepare subscription data
      const subscriptionData = {
        products: cartItems.map(item => ({
          product: item.product._id,
          productType: item.productType,
          quantity: item.quantity,
          basePrice: item.basePrice || item.product.price,
        })),
        customerInfo: {
          name: values.fullName,
          phone: values.phone,
          email: values.email,
          address: selectedAddress
        },
        startDate: startDate.toISOString(),
        endDate: new Date(startDate.setMonth(startDate.getMonth() + 1)).toISOString(),
        deliverySlot,
        paymentMethod: paymentMethod === 'online' ? 'PhonePe' : 'COD',
        paymentProof: paymentMethod === 'online' ? { utr: paymentProof } : undefined,
        totalPrice,
        notes
      };

      await dispatch(createSubscription(subscriptionData));

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to complete checkout');
      setSubmitting(false);
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900">Subscription Successful!</h2>
          <p className="mt-2 text-gray-600">
            Your subscription has been created successfully. Redirecting...
          </p>
          <button
            onClick={() => navigate('/subscriptionpage')}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Subscriptions Now
          </button>
        </div>
      </div>
    );
  }

  if (userInfoStatus === 'loading') {
    return <div className="text-center py-8">Loading user information...</div>;
  }

  if (userInfoStatus === 'failed') {
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load user information. Please try again.
      </div>
    );
  }


  return (
    <>
    <Header/>
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left side - User Info and Payment Form */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            
            <Formik
              initialValues={{
                fullName: userInfo?.fullName || '',
                email: userInfo?.email || '',
                phone: userInfo?.phone || '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, isValid, dirty }) => (
                <Form>
                  <div className="mb-4">
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <Field
                      type="text"
                      id="fullName"
                      name="fullName"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Field
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
                    
                    {!selectedAddress ? (
                      <div className="mb-4">
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(true)}
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-md transition-colors duration-200"
                        >
                          + Add Delivery Address
                        </button>
                      </div>
                    ) : (
                      <div className="mb-4 border border-gray-200 rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2">
                                {selectedAddress.type || 'Address'}
                              </span>
                            </div>
                            <p className="font-medium text-gray-900">{selectedAddress.street}</p>
                            <p className="text-gray-600 text-sm">
                              {selectedAddress.area}, {selectedAddress.city} - {selectedAddress.pincode}
                            </p>
                            {selectedAddress.googleMapLink && (
                              <a 
                                href={selectedAddress.googleMapLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 text-xs mt-1 inline-block hover:underline"
                              >
                                View on Google Maps
                              </a>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(true)}
                            className="text-blue-500 text-sm"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Slot
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDeliverySlot('6-8AM')}
                          className={`py-2 px-4 rounded-md border ${
                            deliverySlot === '6-8AM' 
                              ? 'border-blue-500 bg-blue-50 text-blue-600' 
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          6-8 AM
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeliverySlot('8-10AM')}
                          className={`py-2 px-4 rounded-md border ${
                            deliverySlot === '8-10AM' 
                              ? 'border-blue-500 bg-blue-50 text-blue-600' 
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          8-10 AM
                        </button>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        minDate={new Date()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                      </label>
                      <div className="flex items-center mb-2">
                        <input
                          type="radio"
                          id="onlinePayment"
                          name="paymentMethod"
                          value="online"
                          checked={paymentMethod === 'online'}
                          onChange={() => setPaymentMethod('online')}
                          className="mr-2"
                        />
                        <label htmlFor="onlinePayment" className="text-sm">
                          Online Payment
                        </label>
                      </div>
                    </div>

                    {paymentMethod === 'online' && (
                      <div className="mb-4">
                        <label htmlFor="paymentProof" className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Proof (UTR Number)
                        </label>
                        <input
                          type="text"
                          id="paymentProof"
                          value={paymentProof}
                          onChange={(e) => setPaymentProof(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    )}

                    <div className="mb-4">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes
                      </label>
                      <textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    // disabled={isSubmitting || !isValid || !dirty || subscriptionStatus === 'loading' || !selectedAddress}
                    className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isSubmitting || subscriptionStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {subscriptionStatus === 'loading' ? 'Processing...' : 'Complete Subscription'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Right side - Cart Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="border-b border-gray-200 pb-4 mb-4">
              {cartItems.map((item) => (
                <div key={`${item.product._id}-${item.productType}`} className="flex justify-between mb-2">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    {item.notes && <p className="text-xs text-gray-500">Note: {item.notes}</p>}
                  </div>
                  <p className="font-medium">₹{item.product.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between mb-2">
                <p>Subtotal</p>
                <p>₹{totalPrice}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Tax</p>
                <p>₹0.00</p>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg mb-6">
              <p>Total</p>
              <p>₹{totalPrice}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Delivery Information</h3>
              {selectedAddress ? (
                <>
                  <p className="text-sm">{selectedAddress.street}</p>
                  <p className="text-sm">{selectedAddress.area}, {selectedAddress.city}</p>
                  <p className="text-sm mt-2">
                    <span className="font-medium">Slot:</span> {deliverySlot}
                  </p>
                </>
              ) : (
                <p className="text-sm text-red-500">No address selected</p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-md mt-4">
              <h3 className="font-medium mb-2">Payment Method</h3>
              <p>{paymentMethod === 'online' ? 'Online Payment' : 'Other'}</p>
              {paymentMethod === 'online' && paymentProof && (
                <p className="text-sm mt-1">UTR: {paymentProof}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-md mt-12 mb-8">
            <div className="sticky top-0 bg-white py-4 px-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">Add Delivery Address</h2>
              <button 
                onClick={() => setShowAddressForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Home', 'Work', 'Other'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAddressFormData({...addressFormData, type})}
                        className={`py-2 text-sm rounded-md border ${
                          addressFormData.type === type 
                            ? 'border-blue-500 bg-blue-50 text-blue-600' 
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address</label>
                  <textarea
                    name="street"
                    value={addressFormData.street}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="House/Flat No, Building, Street"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
  <select
    name="area"
    value={addressFormData.area}
    onChange={handleAddressInputChange}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  >
    <option value="">Select an area</option>
    {areas.map(area => (
      <option key={area} value={area}>{area}</option>
    ))}
  </select>
</div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={addressFormData.city}
                      onChange={handleAddressInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={addressFormData.state}
                      onChange={handleAddressInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="State"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={addressFormData.pincode}
                      onChange={handleAddressInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="6-digit pincode"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location Pin</label>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                      className={`px-3 py-2 text-sm rounded-md border ${
                        locationLoading 
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : 'bg-white border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {locationLoading ? 'Locating...' : 'Use Current Location'}
                    </button>
                  </div>
                  
                  {isLoaded && (
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={coords || { lat: 20.5937, lng: 78.9629 }}
                      zoom={coords ? 15 : 5}
                      onClick={handleMapClick}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                        styles: [
                          {
                            featureType: "poi",
                            stylers: [{ visibility: "off" }]
                          }
                        ]
                      }}
                    >
                      {coords && (
                        <Marker 
                          position={coords} 
                          icon={{
                            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                            fillColor: "#4285F4",
                            fillOpacity: 1,
                            strokeColor: "#fff",
                            strokeWeight: 1,
                            scale: 1.5
                          }}
                        />
                      )}
                    </GoogleMap>
                  )}
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Save Address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default CheckoutPage;