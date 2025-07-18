import React from 'react';
import { useNavigate } from 'react-router-dom';
// import juiceBanner from './path-to-premium-juice-banner.jpg'; // Use a high-res professional image

export const JuiceSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-sm font-medium text-green-600 bg-green-50 rounded-full mb-4">
            NUTRITION SOLUTIONS
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Premium <span className="text-green-600">Cold-Pressed</span> Juices
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Scientifically formulated, nutrient-dense juices for optimal health and wellness
          </p>
        </div>

        {/* Juice Card */}
        <div 
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer 
                    transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2
                    border border-gray-100 group"
          onClick={() => navigate('/products')}
        >
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
              <img 
                src="https://media.istockphoto.com/id/821583034/photo/various-fruits-juices.jpg?s=612x612&w=0&k=20&c=oHI_Qv-Ci2vRjiJFYcFY40F-nPGJCRvw6fTHhM-TyUg="
                alt="Premium Cold-Pressed Juices"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            </div>

            {/* Content Section */}
            <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-green-600 font-semibold">Healthy Fruit Juices</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-sm font-medium text-gray-500">WELLNESS DIVISION</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Nutritional Juice Programs</h3>
                <p className="text-gray-600 mb-6">
                  Our clinically-developed juice formulations deliver maximum bioavailability of vitamins,
                  minerals, and phytonutrients for corporate wellness programs and individual health optimization.
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    HACCP Certified
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Organic Ingredients
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Nutrient Analysis
                  </span>
                </div>

                <button className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-300">
                  Explore Juice Portfolio
                  <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Features */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: "Rapid Nutrient Absorption",
              description: "Cold-pressed technology preserves enzymatic activity for better bioavailability"
            },
            {
              icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              title: "Quality Certified",
              description: "GMP, HACCP, and ISO certified production facilities"
            },
            {
              icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Corporate Wellness",
              description: "Customizable programs for employee health initiatives"
            },
            {
              icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              ),
              title: "Sustainable Packaging",
              description: "Eco-friendly materials with extended shelf life"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="ml-3 text-lg font-medium text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};