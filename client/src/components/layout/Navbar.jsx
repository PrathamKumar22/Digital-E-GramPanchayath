import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-900 text-white py-5 px-8 sticky top-0 z-50 shadow-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-center relative">
        
        {/* CENTER ONLY: Branding is the star of the show */}
        <div className="text-center">
          <Link to="/" className="block">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">
              Panchayat <span className="text-yellow-400 not-italic">Portal</span>
            </h1>
          </Link>
        </div>

        {/* Note: Logout and Home are removed from here as per your request */}
      </div>
    </nav>
  );
};

export default Navbar;