import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bell, FileText, Home, LogOut } from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-72 bg-[#0f172a] h-screen sticky top-0 text-white p-6 flex flex-col border-r border-white/5 shadow-2xl">
      {/* Admin Branding */}
      <div className="mb-10 px-2">
        <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Admin Panel</p>
        <h2 className="text-xl font-bold tracking-tight">Village Control Center</h2>
      </div>

      {/* Main Navigation (User Directory Removed) */}
      <nav className="space-y-2 flex-1">
        <Link 
          to="/admin-dashboard" 
          className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm ${isActive('/admin-dashboard') ? 'bg-blue-600 shadow-lg shadow-blue-900/50' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
        >
          <LayoutDashboard size={20} /> Overview
        </Link>
        
        <Link 
          to="/admin-notices" 
          className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm ${isActive('/admin-notices') ? 'bg-blue-600 shadow-lg shadow-blue-900/50' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
        >
          <Bell size={20} /> Village Notices
        </Link>

        <Link 
          to="/admin-certificates" 
          className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm ${isActive('/admin-certificates') ? 'bg-blue-600 shadow-lg shadow-blue-900/50' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
        >
          <FileText size={20} /> Certificates
        </Link>
      </nav>

      {/* Footer Section: Home and Logout */}
      <div className="pt-6 border-t border-white/5 space-y-2">
        <Link 
          to="/" 
          className="flex items-center gap-3 p-4 w-full rounded-2xl text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/10 transition-all font-bold text-sm"
        >
          <Home size={20} /> Back to Home
        </Link>

        <button 
          onClick={onLogout}
          className="flex items-center gap-3 p-4 w-full rounded-2xl text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold text-sm"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;