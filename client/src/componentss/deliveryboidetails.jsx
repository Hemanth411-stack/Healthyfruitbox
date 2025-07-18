import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux'; 
const DeliveryBoysList = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const  token  = useSelector((state) => state.user?.userInfo?.token);
  useEffect(() => {
    const fetchDeliveryBoys = async () => {
       try {
        const response = await axios.get(
          'http://localhost:5000/api/deliveryboi/delivery-details',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDeliveryBoys(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
        console.error('Error fetching delivery boy details:', err);
      }
    };

    fetchDeliveryBoys();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Delivery Boys</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveryBoys.map((boy) => (
          <div key={boy._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 text-blue-800 rounded-full p-3 mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{boy.name}</h2>
                  <p className="text-gray-600">{boy.phone}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Service Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {boy.serviceAreas.map((area, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <p>Joined: {new Date(boy.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            {/* <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
              <button className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Edit
              </button>
              <button className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                Delete
              </button>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryBoysList;