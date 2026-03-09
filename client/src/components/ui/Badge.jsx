import React from 'react';

const Badge = ({ children, variant = 'info' }) => {
  const styles = {
    info: 'bg-blue-100 text-blue-700',
    urgent: 'bg-red-100 text-red-700 uppercase font-black animate-pulse',
    new: 'bg-green-100 text-green-700'
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] ${styles[variant] || styles.info}`}>
      {children}
    </span>
  );
};

export default Badge;