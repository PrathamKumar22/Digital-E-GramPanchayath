import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, 
  FileText, 
  Home as HomeIcon, 
  LogOut, 
  List, 
  Bell, 
  Megaphone, 
  Send, 
  Trash2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, issuedToday: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Notice Form State
  const [newNoticeTitle, setNewNoticeTitle] = useState("");
  const [newNoticeContent, setNewNoticeContent] = useState("");
  const [allNotices, setAllNotices] = useState([]); 

  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
    fetchNotices();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/requests/all', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const allReqs = response.data.requests;
        setStats({
          total: allReqs.length,
          pending: allReqs.filter(r => r.status === 'Pending').length,
          issuedToday: allReqs.filter(r => r.status === 'Approved').length
        });
        setRecentRequests(allReqs.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching overview data:", error);
    }
  };

  const fetchNotices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notices');
      setAllNotices(res.data);
    } catch (err) {
      console.error("Error loading notices:", err);
    }
  };

  const handlePostNotice = async () => {
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) {
        return alert("Please fill in both the Title and the Content");
    }
    
    try {
      const payload = {
        title: newNoticeTitle,
        content: newNoticeContent,
        type: "New"
      };

      const response = await axios.post('http://localhost:5000/api/notices', payload);
      
      if (response.data) {
        alert("Broadcasted successfully to Panchayat Portal!");
        setNewNoticeTitle(""); 
        setNewNoticeContent(""); 
        fetchNotices(); // Refresh history list
      }
    } catch (err) {
      console.error("Broadcast failed:", err);
      alert("Failed to send notice to server.");
    }
  };

  const handleDeleteNotice = async (id) => {
    if (window.confirm("Delete this notice forever?")) {
      try {
        await axios.delete(`http://localhost:5000/api/notices/${id}`);
        fetchNotices();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* --- SIDEBAR --- */}
      <div className="w-72 bg-[#172554] text-white p-6 flex flex-col shadow-2xl">
        <div className="mb-12 mt-4 px-4">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Admin Panel</h1>
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Village Control Center</p>
        </div>
        
        <nav className="space-y-3 flex-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <LayoutDashboard size={22} /> Overview
          </button>

          <button 
            onClick={() => setActiveTab('notices')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'notices' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <Bell size={22} /> Village Notices
          </button>

          <button 
            onClick={() => navigate('/admin-certificates')}
            className="w-full flex items-center gap-4 px-6 py-4 text-slate-400 hover:bg-white/5 rounded-2xl font-bold transition-all"
          >
            <FileText size={22} /> Certificates
          </button>

          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-4 px-6 py-4 text-slate-400 hover:bg-white/5 rounded-2xl font-bold transition-all"
          >
            <HomeIcon size={22} /> Home
          </button>
        </nav>

        <button 
          onClick={() => { localStorage.clear(); navigate('/login'); }}
          className="flex items-center gap-4 px-6 py-4 text-red-400 font-bold hover:bg-red-500/10 rounded-2xl transition-all border-t border-white/5"
        >
          <LogOut size={22} /> Logout
        </button>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 p-12 overflow-y-auto">
        {activeTab === 'overview' ? (
          <>
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">System Overview</h2>
              <div className="px-6 py-2 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center gap-2 text-[10px] font-black tracking-widest border border-emerald-500/20">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> ONLINE
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border-l-8 border-blue-600">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Applications</p>
                <h3 className="text-5xl font-black text-slate-900">{stats.total}</h3>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border-l-8 border-orange-500">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Pending</p>
                <h3 className="text-5xl font-black text-orange-600">{stats.pending}</h3>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border-l-8 border-emerald-500">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Approved</p>
                <h3 className="text-5xl font-black text-emerald-600">{stats.issuedToday}</h3>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm flex items-center gap-3">
                  <List size={20} className="text-blue-600" /> Recent Requests
                </h3>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-10 py-6">Service Type</th>
                    <th className="px-10 py-6">Applicant</th>
                    <th className="px-10 py-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-blue-50/30 transition-all">
                      <td className="px-10 py-6 font-bold text-slate-700">{req.serviceType}</td>
                      <td className="px-10 py-6 text-slate-500 font-bold">{req.userId?.name || 'User'}</td>
                      <td className="px-10 py-6">
                        <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest ${
                          req.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'
                        }`}>{req.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* --- VILLAGE NOTICES VIEW (INTEGRATED) --- */
          <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-100 h-fit">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-orange-100 p-4 rounded-2xl text-orange-600">
                  <Megaphone size={28} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 uppercase tracking-tight">New Broadcast</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase">Official Portal</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <input 
                  type="text"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  placeholder="Notice Title (e.g. Gram Sabha Meeting)"
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-700"
                />
                <textarea 
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  placeholder="Full details of the announcement..."
                  className="w-full h-48 p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-slate-700 font-medium focus:border-blue-500 focus:outline-none transition-all resize-none"
                />
              </div>

              <button 
                onClick={handlePostNotice}
                className="w-full py-5 bg-blue-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-800 transition-all shadow-xl shadow-blue-200"
              >
                <Send size={20} /> Broadcast Now
              </button>
            </div>

            {/* Live History Section */}
            <div className="lg:col-span-3 bg-slate-100/50 rounded-[3rem] p-8 border border-slate-200">
               <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] mb-6 px-4">Active Notices on Home Page</h3>
               <div className="space-y-4">
                 {allNotices.length === 0 && <p className="text-center text-slate-400 py-10 font-bold italic">No active notices</p>}
                 {allNotices.map((n) => (
                   <div key={n._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-start gap-4">
                     <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black px-2 py-0.5 bg-blue-50 text-blue-600 rounded uppercase">Live</span>
                          <p className="text-xs font-bold text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</p>
                       </div>
                       <h4 className="font-black text-slate-800 uppercase text-sm mb-1">{n.title}</h4>
                       <p className="text-sm text-slate-600 leading-relaxed">{n.content}</p>
                     </div>
                     <button onClick={() => handleDeleteNotice(n._id)} className="text-slate-300 hover:text-red-500 transition-colors p-2">
                       <Trash2 size={20} />
                     </button>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;