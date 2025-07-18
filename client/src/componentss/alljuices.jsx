import React from 'react';
import { useNavigate } from 'react-router-dom';

export const CorporateJuiceSubscriptions = () => {
  const navigate = useNavigate();

  const subscriptionPrograms = [
    {
      id: 1,
      name: "ABC Vitality Program",
      scientific: "(Malus domestica, Beta vulgaris, Daucus carota)",
      description: "30-day executive detox program with antioxidant-rich formulation for cellular protection and energy metabolism support.",
      price: "¥8,499/month",
      image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1b/6e/b9/58/mango-juice.jpg",
      benefits: [
        "72% higher ORAC value vs standard juices",
        "Triple-action detox support",
        "Clinically studied phytonutrients"
      ],
      delivery: "Daily (Mon-Fri)",
      servings: "20 servings/month",
      bestFor: "Leadership teams, high-stress roles"
    },
    {
      id: 2,
      name: "Carotenoid Defense Program",
      scientific: "(Daucus carota)",
      description: "Monthly ocular and dermal protection program for screen-intensive professionals with high-potency carotenoids.",
      price: "¥6,999/month",
      image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1b/6e/b9/58/mango-juice.jpg",
      benefits: [
        "300% RDA vitamin A per serving",
        "Blue light protection compounds",
        "Collagen production support"
      ],
      delivery: "3x weekly",
      servings: "12 servings/month",
      bestFor: "IT teams, digital workforce"
    },
    {
      id: 3,
      name: "Performance Nitrate Program",
      scientific: "(Beta vulgaris)",
      description: "Athletic performance and cardiovascular optimization program with nitric oxide boosting formulation.",
      price: "¥7,499/month",
      image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1b/6e/b9/58/mango-juice.jpg",
      benefits: [
        "12% VO2 max improvement shown in studies",
        "Enhanced oxygen utilization",
        "Exercise recovery support"
      ],
      delivery: "Pre-shift delivery",
      servings: "16 servings/month",
      bestFor: "Field teams, corporate athletes"
    },
    {
      id: 4,
      name: "Moringa Immunity Program",
      scientific: "(Moringa oleifera)",
      description: "Comprehensive micronutrient program with 92 essential nutrients for immune resilience and executive wellness.",
      price: "¥7,999/month",
      image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1b/6e/b9/58/mango-juice.jpg",
      benefits: [
        "46 verified antioxidants",
        "Adaptogenic stress support",
        "Bioavailable iron complex"
      ],
      delivery: "Daily (Mon-Sat)",
      servings: "26 servings/month",
      bestFor: "Frequent travelers, management"
    },
    {
      id: 5,
      name: "Metabolic Reset Program",
      scientific: "(Benincasa hispida)",
      description: "Gentle 30-day digestive reset and metabolic optimization protocol with nutritional counseling included.",
      price: "¥5,999/month",
      image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1b/6e/b9/58/mango-juice.jpg",
      benefits: [
        "Alkaline-forming electrolytes",
        "Gut microbiome support",
        "Liver detox enzymes"
      ],
      delivery: "MWF delivery",
      servings: "12 servings/month",
      bestFor: "Workforce wellness initiatives"
    },
    {
      id: 6,
      name: "Executive Hydration Program",
      scientific: "(Lagenaria siceraria)",
      description: "Premium electrolyte and mineral replenishment system for cognitive performance and meeting endurance.",
      price: "¥6,499/month",
      image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1b/6e/b9/58/mango-juice.jpg",
      benefits: [
        "98% mineral bioavailability",
        "Neural conductivity support",
        "Natural nootropics"
      ],
      delivery: "Twice daily (AM/PM)",
      servings: "40 servings/month",
      bestFor: "C-suite, decision-makers"
    },
    {
      id: 7,
      name: "Cellular Refresh Program",
      scientific: "(Cucumis sativus)",
      description: "Silica-rich connective tissue and detoxification program for anti-fatigue and skin health benefits.",
      price: "¥5,499/month",
      image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1b/6e/b9/58/mango-juice.jpg",
      benefits: [
        "High bioavailable silica",
        "Natural diuretic compounds",
        "Collagen synthesis support"
      ],
      delivery: "Daily afternoon",
      servings: "20 servings/month",
      bestFor: "Client-facing roles"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Corporate Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Wellness Solutions
          </button>
          <div className="text-right">
            <p className="text-sm text-gray-500">Corporate Nutrition Division</p>
            <p className="font-medium text-green-600">VARAHI Performance Nutrition</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Corporate <span className="text-green-600">Juice Subscription</span> Programs
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Monthly nutritional interventions tailored to organizational wellness KPIs and employee health metrics
          </p>
        </div>

        {/* Subscription Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {subscriptionPrograms.map((program) => (
            <div key={program.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group">
              <div className="h-48 w-full overflow-hidden relative">
                <img 
                  src={program.image} 
                  alt={program.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">{program.name}</h3>
                  <p className="text-sm text-green-200">{program.scientific}</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded mb-2">
                      {program.servings}
                    </span>
                    <p className="text-gray-600">{program.description}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Delivery Schedule</h4>
                      <p className="text-sm text-gray-600">{program.delivery}</p>
                    </div>
                    <span className="text-lg font-bold text-green-600">{program.price}</span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Optimal For</h4>
                    <p className="text-sm text-gray-600">{program.bestFor}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Clinical Benefits</h4>
                    <ul className="space-y-2">
                      {program.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-sm text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <button className="mt-6 w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors duration-300 shadow-sm">
                  Enroll Team
                  <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Solutions */}
        <div className="bg-gradient-to-r from-gray-900 to-green-900 rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">Custom Corporate Nutrition Solutions</h3>
            <p className="text-xl text-green-100 max-w-4xl mx-auto mb-8">
              Our registered dietitians develop bespoke juice programs aligned with your organizational health objectives, workforce demographics, and wellness KPIs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  icon: (
                    <svg className="w-10 h-10 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  ),
                  title: "Needs Assessment",
                  text: "Comprehensive workforce health analysis"
                },
                {
                  icon: (
                    <svg className="w-10 h-10 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  ),
                  title: "Program Design",
                  text: "Tailored formulations and delivery protocols"
                },
                {
                  icon: (
                    <svg className="w-10 h-10 text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                  title: "Impact Analytics",
                  text: "ROI measurement and health outcome tracking"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                  {feature.icon}
                  <h4 className="text-lg font-bold text-white mt-4">{feature.title}</h4>
                  <p className="text-green-100 mt-2">{feature.text}</p>
                </div>
              ))}
            </div>
            <button className="mt-10 inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100 transition-colors duration-300 shadow-lg">
              Schedule Enterprise Consultation
              <svg className="ml-3 -mr-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};