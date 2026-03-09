import React from 'react';

const Input = ({ label, type = "text", placeholder, value, onChange, icon: Icon }) => (
  <div className="mb-4">
    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight px-1">
      {label}
    </label>
    <div className="relative">
      {/* Absolute icon positioning */}
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon size={20} />
        </div>
      )}
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        // pl-12 is the key fix to prevent text-icon overlap
        className="w-full pl-12 pr-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all"
      />
    </div>
  </div>
);

export default Input;