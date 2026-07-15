import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, MapPin, Phone, Shield, Save, 
  ArrowLeft, Camera, Edit2, CheckCircle 
} from 'lucide-react';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Ref for functional camera icon
  
  // Pulls current user from local storage
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Checks for admin role to switch theme
  const isAdmin = user.role === 'admin';

  // 1. Function to trigger hidden file input
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // 2. Function to handle image selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Updates state with the new image string
        setUser({ ...user, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const token = localStorage.getItem('token');
      // Sends updated user data (including profilePic) to server
      const res = await axios.put('https://digital-e-grampanchayath-1.onrender.com/api/users/profile/update', user, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Save the fresh data back to storage
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Sync failed: " + (err.response?.data?.error || "Server Error"));
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Zen Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-400 font-semibold hover:text-blue-600 transition-all group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Return to Dashboard
        </button>

        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
          
          {/* Header - Role Based Theme */}
          <div className={`p-12 text-white relative overflow-hidden transition-all duration-700 ${
            isAdmin 
              ? "bg-gradient-to-br from-amber-400 to-orange-500" 
              : "bg-gradient-to-br from-blue-600 to-indigo-800"
          }`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              
              {/* Functional Profile Photo */}
              <div className="relative group">
                <div className="h-36 w-36 bg-white/20 rounded-[2.8rem] flex items-center justify-center backdrop-blur-md border-2 border-white/40 shadow-2xl overflow-hidden">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User size={64} className="text-white" />
                  )}
                </div>
                
                {/* Functional Camera Trigger */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  className="hidden" 
                  accept="image/*" 
                />
                <button 
                  type="button"
                  onClick={triggerFileInput}
                  className="absolute bottom-2 right-2 bg-white text-slate-800 p-2.5 rounded-2xl shadow-xl hover:scale-110 active:scale-90 transition-all"
                >
                  <Camera size={20} />
                </button>
              </div>

              <div className="text-center md:text-left">
                <h1 className="text-4xl font-black tracking-tight">{user.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.15em] bg-black/15 backdrop-blur-md px-5 py-2 rounded-full border border-white/10">
                    <Shield size={12} /> {isAdmin ? 'Administrator' : 'Citizen'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="p-10 md:p-14 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              
              {/* Input Fields with Edit Icons */}
              {[
                { label: 'Full Name', icon: User, key: 'name', type: 'text' },
                { label: 'Mobile Number', icon: Phone, key: 'phone', type: 'text' },
                { label: 'Assigned Village', icon: MapPin, key: 'village', type: 'text' }
              ].map((field) => (
                <div key={field.key} className="group space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                    <Edit2 size={12} className="text-slate-200 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <div className="relative">
                    <field.icon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type={field.type} 
                      className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border-2 border-transparent rounded-[1.25rem] font-bold text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 outline-none transition-all shadow-sm"
                      value={user[field.key] || ''} 
                      onChange={(e) => setUser({...user, [field.key]: e.target.value})} 
                    />
                  </div>
                </div>
              ))}

              {/* Read Only Email */}
              <div className="space-y-3 opacity-60">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Account Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="email" 
                    readOnly 
                    className="w-full pl-14 pr-6 py-4.5 bg-slate-100 border-2 border-transparent rounded-[1.25rem] font-bold text-slate-400 cursor-not-allowed"
                    value={user.email || ''} 
                  />
                </div>
              </div>
            </div>

            {/* Zen Submit Button */}
            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-5 rounded-[1.8rem] font-black text-lg shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 ${
                  success 
                    ? "bg-emerald-500 text-white shadow-emerald-200" 
                    : isAdmin 
                      ? "bg-amber-400 hover:bg-amber-500 text-amber-900 shadow-amber-200" 
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                }`}
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : success ? (
                  <><CheckCircle size={22} /> Synced Successfully</>
                ) : (
                  <><Save size={22} /> Save Profile Changes</>
                )}
              </button>
            </div>
          </form>
          
          <div className="bg-slate-50/50 p-8 text-center border-t border-slate-100/50">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
              Gram Panchayat Digital Security Cell
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;