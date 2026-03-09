import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FileText, PlusCircle, Bell, ArrowRight, 
  CheckCircle2, Clock, ShieldCheck, LogOut,
  User, Mail, MapPin, Settings, AlertCircle, XCircle
} from 'lucide-react';

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  
  // Dynamic user data recovery from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Fetch recent applications for the "Recent Activity" section
  useEffect(() => {
    const fetchRecentRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/requests/my-requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // UPDATED: Removed .slice(0, 3) so you have enough items to scroll
        setRequests(res.data.requests);
      } catch (err) {
        console.error("Error fetching activity:", err);
      }
    };
    fetchRecentRequests();
  }, []);

  // Helper for status badge colors
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Pending': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <ShieldCheck size={20} />
            </div>
            <span className="text-lg font-black tracking-tighter italic text-slate-900">
              PANCHAYAT<span className="text-blue-600">PORTAL</span>
            </span>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 text-center border border-slate-100 mb-6">
            <div className="h-20 w-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-100 overflow-hidden">
              {user.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User size={36} />
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">{user.name}</h2>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-100/50 px-3 py-1 rounded-full inline-block mt-2">
              {user.role === 'admin' ? 'Administrator' : 'Verified Citizen'}
            </p>
            
            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-center gap-3 text-slate-500 text-xs font-semibold">
                <Mail size={14} className="text-blue-500 shrink-0" /> 
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-xs font-semibold">
                <MapPin size={14} className="text-blue-500 shrink-0" /> 
                <span>{user.village || 'N/A'}</span>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => navigate('/profile')} 
              className="w-full flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-sm transition-all group"
            >
              <Settings size={18} className="group-hover:rotate-45 transition-transform" /> 
              Account Settings
            </button>
            <button 
              onClick={onLogout} 
              className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-xl font-bold text-sm transition-all"
            >
              <LogOut size={18} /> Log Out
            </button>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Village Services Overview</p>
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 shadow-sm transition-all">
            <Bell size={20} />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div onClick={() => navigate('/services')} className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-xl shadow-blue-100 cursor-pointer hover:-translate-y-1 transition-all group">
            <div className="h-14 w-14 bg-white/20 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <PlusCircle size={28} />
            </div>
            <h3 className="text-3xl font-black mb-1">New Request</h3>
            <p className="text-blue-100 text-sm font-medium opacity-80 uppercase tracking-tighter">Start a certificate application</p>
          </div>

          <div onClick={() => navigate('/my-records')} className="bg-white p-10 rounded-[2.5rem] text-slate-900 shadow-xl shadow-slate-200/50 border border-slate-50 cursor-pointer hover:-translate-y-1 transition-all group">
            <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <FileText size={28} />
            </div>
            <h3 className="text-3xl font-black mb-1 text-indigo-900">My Records</h3>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-tighter">View and download certificates</p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent Activity</h2>
            <button onClick={() => navigate('/my-records')} className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
              View All History <ArrowRight size={14} />
            </button>
          </div>
          
          {/* UPDATED: Added max-height, overflow-y-auto, and custom scrollbar padding */}
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            {requests.length > 0 ? (
              requests.map((req) => (
                <div key={req._id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                      {req.status === 'Approved' ? <CheckCircle2 className="text-green-500" size={20}/> : 
                       req.status === 'Rejected' ? <XCircle className="text-red-500" size={20}/> : 
                       <Clock className="text-amber-500" size={20}/>}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{req.serviceType}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {new Date(req.appliedAt).toLocaleDateString()} • {req.status}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyles(req.status)}`}>
                    {req.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <AlertCircle className="mx-auto text-slate-300 mb-3" size={32} />
                <p className="text-slate-400 font-bold text-sm">No recent applications found.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;