import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; 
import { Mail, Lock, ArrowRight, ShieldCheck, User } from 'lucide-react'; 
import Input from '../components/ui/Input';

const Login = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email);
  const isPasswordValid = credentials.password.length >= 6;

  // UPDATED: Now checks for the word "admin" OR your specific email
  const isAdminLoggingIn = 
    credentials.email.toLowerCase().includes('admin') || 
    credentials.email.toLowerCase() === 'pratham@test.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Clear old session data to prevent role conflicts
    localStorage.clear(); 

    try {
      const res = await axios.post('https://digital-e-grampanchayath-1.onrender.com/api/auth/login', credentials);
      const loggedInUser = res.data.user;

      // CRITICAL DEBUG LOGS - Check these in your browser console (F12)
      console.log("SERVER RESPONSE USER:", loggedInUser);
      console.log("SERVER ROLE:", loggedInUser.role);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(loggedInUser)); 
      
      if (onLoginSuccess) onLoginSuccess(loggedInUser); 

      // Final redirection based on actual database role
      if (loggedInUser.role === 'admin') {
        console.log("Redirecting to Admin Dashboard...");
        navigate('/admin-dashboard', { replace: true });
      } else {
        console.log("Redirecting to Citizen Dashboard...");
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-slate-50 px-4">
      {/* MODE BADGE: Turns Yellow if isAdminLoggingIn is true */}
      <div className={`mb-4 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-500 shadow-sm ${
        isAdminLoggingIn 
          ? "bg-yellow-100 text-yellow-700 border border-yellow-200" 
          : "bg-blue-100 text-blue-700 border border-blue-200"
      }`}>
        {isAdminLoggingIn ? <ShieldCheck size={14}/> : <User size={14}/>}
        {isAdminLoggingIn ? "Administrator Mode" : "Citizen Mode"}
      </div>

      <div className="p-10 bg-white shadow-2xl rounded-[2.5rem] border border-slate-100 w-full max-w-md relative overflow-hidden">
        {/* TOP ACCENT LINE: Turns Yellow if isAdminLoggingIn is true */}
        <div className={`absolute top-0 left-0 right-0 h-2 transition-colors duration-500 ${
          isAdminLoggingIn ? "bg-yellow-400" : "bg-blue-700"
        }`}></div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tight">
            {isAdminLoggingIn ? "Admin Portal" : "Citizen Portal"}
          </h2>
          <p className="text-slate-500 font-medium mt-2">Panchayat Digital Services</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-11 text-slate-400 z-10" size={18} />
            <Input 
              label="Email Address"
              type="email" 
              placeholder="e.g., pratham@test.com" 
              value={credentials.email}
              onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
              style={{ paddingLeft: '2.75rem' }}
              required 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-11 text-slate-400 z-10" size={18} />
            <Input 
              label="Password"
              type="password" 
              placeholder="••••••••" 
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
              style={{ paddingLeft: '2.75rem' }}
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={!isEmailValid || !isPasswordValid || loading}
            className={`w-full p-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
              !isEmailValid || !isPasswordValid || loading
              ? "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed" 
              : isAdminLoggingIn 
                ? "bg-yellow-400 text-blue-900 hover:bg-yellow-500" 
                : "bg-blue-700 text-white hover:bg-blue-800"
            }`}
          >
            {loading ? "Authorizing..." : "Log In"}
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600 font-medium text-sm">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-blue-700 font-black hover:underline underline-offset-4 transition-all"
            >
              Register Now
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Secured by Gram Panchayat Digital Cell
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;