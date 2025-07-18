import React from "react";

const Features = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose FruitBox?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We deliver more than just fruits. We deliver a commitment to
            quality, freshness, and sustainability.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="feature-card bg-white rounded-xl p-8 shadow-lg transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-leaf text-green-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Organic & Fresh
            </h3>
            <p className="text-gray-600">
              All our fruits are 100% organic, pesticide-free, and harvested
              at peak ripeness.
            </p>
          </div>
          <div className="feature-card bg-white rounded-xl p-8 shadow-lg transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-truck text-blue-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Fast Delivery
            </h3>
            <p className="text-gray-600">
              From farm to your doorstep in less than 24 hours, preserving
              freshness and flavor.
            </p>
          </div>
          <div className="feature-card bg-white rounded-xl p-8 shadow-lg transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-box-open text-yellow-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Customizable Boxes
            </h3>
            <p className="text-gray-600">
              Create your perfect fruit mix or let us surprise you with
              seasonal selections.
            </p>
          </div>
          <div className="feature-card bg-white rounded-xl p-8 shadow-lg transform hover:-translate-y-2 transition-all duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-heart text-red-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Eco-Friendly
            </h3>
            <p className="text-gray-600">
              Sustainable packaging and zero-waste approach to protect our
              planet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;