import React, { useEffect, useState } from 'react';
import logo from '../assets/bg-images/bg1.jpg'; // ✅ No curly braces

const HeroSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      title: "Fresh Fruits Delivered Weekly",
      description: "Get seasonal fruits hand-picked at peak ripeness straight to your door",
      cta: "Start Your Subscription",
      bgImage: logo,
      
    },
    // {
    //   title: "Organic & Locally Sourced",
    //   description: "Support local farmers while enjoying the freshest produce available",
    //   cta: "Meet Our Farmers",
    //   bgImage: "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    //   overlay: "bg-orange-500/30"
    // },
    // {
    //   title: "Customize Your Fruit Box",
    //   description: "Choose your favorites or let us surprise you with seasonal selections",
    //   cta: "Build Your Box",
    //   bgImage: "https://images.unsplash.com/photo-1603569296018-3849a14b8a3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    //   overlay: "bg-purple-500/30"
    // }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
        setIsAnimating(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    if (index !== activeSlide && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveSlide(index);
        setIsAnimating(false);
      }, 300);
    }
  };

  const nextSlide = () => goToSlide((activeSlide + 1) % slides.length);
  const prevSlide = () => goToSlide((activeSlide - 1 + slides.length) % slides.length);

  return (
    <section className="relative overflow-hidden h-screen max-h-[800px] top-18">
      {/* Background Slides */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Background Image */}
            <img
              src={slide.bgImage}
              alt=""
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
            
            {/* Color Overlay */}
            <div className={`absolute inset-0 ${slide.overlay}`}></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center z-20">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl bg-white/90 rounded-xl p-8 md:p-10 shadow-lg">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              {slides[activeSlide].title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              {slides[activeSlide].description}
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium shadow-md transition-colors duration-300">
              {slides[activeSlide].cta}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}

      {/* Navigation Arrows */}
      {/* <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-colors duration-300 shadow-md"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button> */}
      {/* <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-colors duration-300 shadow-md"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button> */}
    </section>
  );
};

export default HeroSection;