import React, { useEffect, useState } from 'react';

const WhyChooseUs = () => {
  const [activeReason, setActiveReason] = useState(0);

  const reasons = [
    {
      title: "Farm-to-Table in 48 Hours",
      description: "We harvest fruits at peak ripeness and deliver them directly—no warehouse storage, no nutrient loss.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      bg: "bg-orange-50"
    },
    {
      title: "Seasonal Nutrition Focus",
      description: "Each box highlights 3-4 fruits at their nutritional peak with pairing recipes from our chefs.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      bg: "bg-green-50"
    },
    {
      title: "Perfectly Imperfect Program",
      description: "We include 1-2 'ugly' fruits per box (30% cheaper) to reduce food waste without compromising taste.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      bg: "bg-yellow-50"
    },
    {
      title: "Traceable Origins",
      description: "Scan QR codes to see your fruit's journey—farm location, harvest date, and farmer's story.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      ),
      bg: "bg-purple-50"
    }
  ];

  return (
    <section className="relative py-20 bg-white" id='why-us'>
      {/* Floating fruit decoration (static) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-10 left-1/4 text-6xl">🍎</div>
        <div className="absolute top-1/3 right-20 text-5xl">🍊</div>
        <div className="absolute bottom-20 left-20 text-7xl">🥝</div>
        <div className="absolute bottom-1/4 right-1/3 text-6xl">🍍</div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Asymmetric heading with underline effect */}
        <div className="mb-16 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Not your average<br/>
            <span className="relative inline-block">
              fruit delivery
              <span className="absolute bottom-1 left-0 w-full h-3 bg-green-200/60 -z-10"></span>
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            We're reinventing fresh produce with transparency, quality, and a dash of fun.
          </p>
        </div>

        {/* Interactive "card carousel" */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {reasons.map((reason, i) => (
            <div 
              key={i}
              onClick={() => setActiveReason(i)}
              className={`relative p-8 rounded-2xl transition-all duration-300 ${reason.bg} ${
                activeReason === i 
                  ? 'ring-2 ring-green-500 shadow-xl' 
                  : 'shadow-md hover:shadow-lg'
              }`}
            >
              <div className="absolute top-6 right-6">
                {reason.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 pr-12">{reason.title}</h3>
              <p className="text-gray-700">{reason.description}</p>
              {activeReason === i && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500 animate-[grow_0.5s_linear]"></div>
              )}
            </div>
          ))}
        </div>

        {/* Stats with animated counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { number: 200, suffix: "+", label: "Farm Partners" },
            { number: 0, suffix: "", label: "Pesticides Used" },
            { number: 97, suffix: "%", label: "Happy Customers" },
            { number: 48, suffix: "h", label: "Harvest-to-Door" }
          ].map((stat, i) => (
            <div key={i} className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-green-600 mb-2">
                <Counter target={stat.number} />{stat.suffix}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Animated counter component
const Counter = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
};

export default WhyChooseUs;