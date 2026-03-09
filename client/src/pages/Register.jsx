import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', village: '', role: 'citizen'
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      alert(res.data.msg); 
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.msg || "Registration Failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gray-50 py-10">
      <div className="p-8 bg-white shadow-2xl rounded-2xl border border-gray-100 w-full max-w-md">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input type="text" placeholder="Full Name" required className="w-full pl-10 p-3 border rounded-lg focus:outline-blue-500"
              onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input type="email" placeholder="Email Address" required className="w-full pl-10 p-3 border rounded-lg focus:outline-blue-500"
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
            <input type="text" placeholder="Phone Number" required className="w-full pl-10 p-3 border rounded-lg focus:outline-blue-500"
              onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          {/* NEW VILLAGE FIELD */}
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
            <input type="text" placeholder="Village Name" className="w-full pl-10 p-3 border rounded-lg focus:outline-blue-500"
              onChange={(e) => setFormData({...formData, village: e.target.value})} />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input type="password" placeholder="Password (Min 6 characters)" required className="w-full pl-10 p-3 border rounded-lg focus:outline-blue-500"
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="bg-blue-700 text-white p-3 rounded-lg font-bold hover:bg-blue-800 transition-all shadow-lg">
            Register as Citizen
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;