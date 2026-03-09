import React from 'react';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-shadow ${className}`}>
    {children}
  </div>
);

export default Card;