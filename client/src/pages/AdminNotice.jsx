import React, { useState, useEffect } from 'react';
import { Bell, Trash2, ArrowLeft, Send, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminNotice = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [newNoticeTitle, setNewNoticeTitle] = useState("");
  const [newNoticeContent, setNewNoticeContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await axios.get('https://digital-e-grampanchayath-1.onrender.com/api/notices');
      // Sorting by newest first
      const sortedNotices = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotices(sortedNotices);
    } catch (err) {
      console.error("Error loading notices", err);
    }
  };

  const addNotice = async () => {
    if (!newNoticeTitle.trim() || !newNoticeContent.trim()) {
      alert("Please enter both a title and content.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('https://digital-e-grampanchayath-1.onrender.com/api/notices', {
        title: newNoticeTitle,
        content: newNoticeContent,
        type: "New"
      });
      
      setNotices([res.data, ...notices]);
      setNewNoticeTitle("");
      setNewNoticeContent("");
      alert("Notice broadcasted successfully!");
    } catch (err) {
      alert("Failed to save notice to database");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNotice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice? This action cannot be undone.")) return;

    try {
      await axios.delete(`https://digital-e-grampanchayath-1.onrender.com/api/notices/${id}`);
      setNotices(notices.filter(n => n._id !== id));
    } catch (err) {
      alert("Failed to delete notice");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate('/admin-dashboard')}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-700 font-bold transition-all group bg-white px-4 py-2 rounded-xl shadow-sm"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
            <div className="bg-yellow-400 p-3 rounded-2xl shadow-lg shadow-yellow-200 text-white">
              <Bell size={28} />
            </div>
            Notice Management
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Create and manage public announcements for the village portal.</p>
        </header>

        {/* CREATE NOTICE FORM */}
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white mb-12">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Create New Announcement</h3>
          <div className="space-y-4">
            <input 
              type="text" 
              value={newNoticeTitle}
              onChange={(e) => setNewNoticeTitle(e.target.value)}
              placeholder="Notice Title (e.g. Water Supply Interruption)" 
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-800"
            />
            <textarea 
              value={newNoticeContent}
              onChange={(e) => setNewNoticeContent(e.target.value)}
              placeholder="Detailed explanation for the citizens..."
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white outline-none h-40 transition-all resize-none"
            />
            <button 
              onClick={addNotice} 
              disabled={isLoading}
              className={`w-full ${isLoading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'} text-white p-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3`}
            >
              <Send size={20} />
              {isLoading ? 'Publishing...' : 'Broadcast to Village Portal'}
            </button>
          </div>
        </div>

        {/* NOTICES LIST */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Live Notices ({notices.length})</h3>
          </div>
          
          {notices.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold">No active notices found.</p>
            </div>
          ) : (
            notices.map((n) => (
              <div key={n._id} className="group flex justify-between items-start p-6 bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-xl transition-all">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Official</span>
                    <span className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                      <Clock size={14} />
                      {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="font-black text-slate-800 uppercase text-lg">{n.title}</h3>
                  <p className="text-slate-600 leading-relaxed max-w-2xl">{n.content}</p>
                </div>
                <button 
                  onClick={() => deleteNotice(n._id)} 
                  className="opacity-0 group-hover:opacity-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-2xl transition-all"
                  title="Delete Notice"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotice;