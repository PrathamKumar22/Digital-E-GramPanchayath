import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/uploads/hero.png" 
          className="w-full h-full object-cover" 
          alt="Village" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/40 to-transparent" />
      </div>

      <div className="relative z-10 px-10 md:px-20 max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-8 drop-shadow-lg uppercase">
          Your Panchayat, <br/><span className="text-yellow-400">Now in Your Pocket.</span>
        </h1>
        
        <div className="flex gap-6">
          {/* Use the Button component's onClick directly */}
          <Button 
            onClick={() => navigate('/login')} 
            variant="primary"
            className="px-10 py-4 text-xl shadow-2xl transform hover:scale-105 transition-transform"
          >
            Get Started
          </Button>
          
          <a href="#insights">
            <Button 
              variant="outline" 
              className="px-10 py-4 border-2 border-white text-white text-xl hover:bg-white hover:text-blue-900 shadow-2xl transform hover:scale-105 transition-transform"
            >
              Learn More
            </Button>
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-1 h-12 bg-gradient-to-b from-yellow-400 to-transparent rounded-full" />
      </div>
    </section>
  );
};

export default Hero;