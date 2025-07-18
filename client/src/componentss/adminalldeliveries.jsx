import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const DeliveriesList = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.user?.userInfo?.token);
  const navigate = useNavigate();
  console.log("deliveries ",deliveries)
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get(
          'https://healthyfruitbox.onrender.com/api/deliveries/admin/all',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDeliveries(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
        console.error('Error fetching deliveries:', err);
      }
    };

    if (token) {
      fetchDeliveries();
    } else {
      setError('Authentication token not found');
      setLoading(false);
    }
  }, [token]);

  const handleViewDeliveryBoy = (deliveryBoyId) => {
    navigate(`admin-all-deliveriesboidetails/${deliveryBoyId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Today's Deliveries</h2>
        <button
          onClick={() => navigate('/admin-all-deliveriesboidetails')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          View All Delivery Boys
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">User</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">Delivery Date</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">Address</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">Time Slot</th>
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">Status</th>
              
              <th className="py-3 px-4 text-left text-gray-700 font-semibold">Special Day</th>
              {/* <th className="py-3 px-4 text-left text-gray-700 font-semibold">Actions</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {deliveries.map((delivery) => (
              <tr key={delivery._id} className="hover:bg-gray-50">
                <td className="py-4 px-4 text-gray-800">{delivery.user?.name}</td>
                <td className="py-4 px-4 text-gray-600">
                  {new Date(delivery.deliveryDate).toLocaleDateString()}
                  <br />
                  {new Date(delivery.deliveryDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </td>
                <td className="py-4 px-4 text-gray-600">
                  <div className="space-y-1">
                    <div>{delivery.address.street}</div>
                    <div>{delivery.address.area}</div>
<a
  href={delivery.address.googleMapLink}
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-500 underline"
>
  View on Google Maps
</a>

                    <div>{delivery.address.city}, {delivery.address.state} - {delivery.address.pincode}</div>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">{delivery.slot}</td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    delivery.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    delivery.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {delivery.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-600">
                  {delivery.isFestivalOrSunday ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      Yes
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      No
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  {delivery.deliveryBoy && (
                    <button
                      onClick={() => handleViewDeliveryBoy(delivery.deliveryBoy._id)}
                      className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      View Delivery Boy
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deliveries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No deliveries found for today</p>
        </div>
      )}
    </div>
  );
};

export default DeliveriesList;