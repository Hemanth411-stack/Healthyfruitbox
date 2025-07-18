import React from 'react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const CustomerReviews = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const reviews = [
    {
      id: 1,
      name: 'Priya Sharma',
      location: 'Bangalore',
      rating: 5,
      comment: 'The fruits are always fresh and last longer than supermarket ones. My kids love the weekly surprise!',
      photo: 'https://randomuser.me/api/portraits/women/42.jpg'
    },
    {
      id: 2,
      name: 'Rahul Patel',
      location: 'Mumbai',
      rating: 4,
      comment: 'Convenient delivery and excellent quality. The seasonal selection introduces us to new fruits we would never try otherwise.',
      photo: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 3,
      name: 'Ananya Gupta',
      location: 'Delhi',
      rating: 5,
      comment: 'The "ugly fruit" option helps reduce food waste while saving money. Taste is perfect every time!',
      photo: 'https://randomuser.me/api/portraits/women/63.jpg'
    }
  ];

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="py-16 bg-gradient-to-b from-green-50 to-white"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What Our Customers Say
          </h2>
          <div className="w-20 h-1 bg-green-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img 
                  src={review.photo} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-bold text-gray-800">{review.name}</h3>
                  <p className="text-gray-600 text-sm">{review.location}</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 italic">"{review.comment}"</p>
              <div className="mt-4 flex justify-end">
                <span className="text-4xl text-green-200">”</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg transition-all duration-300 transform hover:scale-105">
            Read More Reviews
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default CustomerReviews;