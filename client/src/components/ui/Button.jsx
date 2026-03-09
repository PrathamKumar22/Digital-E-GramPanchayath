import React from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  const variants = {
    primary: 'bg-yellow-400 text-blue-900 hover:bg-yellow-500',
    outline: 'border-2 border-white/30 text-white hover:bg-white/10',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button 
      onClick={onClick}
      className={`px-8 py-3 rounded-full font-black transition-all shadow-md active:scale-95 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;