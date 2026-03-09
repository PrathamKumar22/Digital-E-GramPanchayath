import React from 'react';
import { Bell, Info } from 'lucide-react';
import Badge from '../ui/Badge';

const NoticeBoard = ({ notices = [] }) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-200 group">
      {/* Left Branding Side */}
      <div className="bg-blue-700 p-8 md:w-1/3 text-white flex flex-col justify-center relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 bg-white/10 w-32 h-32 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        
        <div className="relative z-10">
          <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
            <Bell size={28} className="text-yellow-400 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Notice Board</h2>
          <p className="text-blue-100 text-sm mt-2 font-medium opacity-90">
            Stay informed with the latest official village announcements.
          </p>
        </div>
      </div>

      {/* Right Content Side */}
      <div className="p-8 md:w-2/3 space-y-4 max-h-[350px] overflow-y-auto custom-scrollbar bg-white">
        {notices.length > 0 ? (
          notices.map((n) => (
            <div 
              key={n._id} // MongoDB uses _id instead of id
              className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0 hover:bg-blue-50/30 p-2 transition-colors rounded-xl"
            >
              {/* Date Column */}
              <div className="flex flex-col items-center">
                <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-lg text-[10px] whitespace-nowrap shadow-sm uppercase">
                  {/* Format the MongoDB ISO date to a readable format */}
                  {new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                </span>
              </div>

              {/* Content Column */}
              <div className="flex-1">
                <div className="flex flex-col gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    {/* Changed from n.msg to n.title to match database */}
                    <h3 className="font-bold text-slate-800 text-sm leading-snug">
                      {n.title}
                    </h3>
                    {/* Dynamic Badges based on schema field */}
                    {n.type === 'Urgent' && <Badge variant="urgent">Urgent</Badge>}
                    {(n.type === 'New' || !n.type) && <Badge variant="new">New</Badge>}
                  </div>
                  
                  {/* Added n.content to display the actual message body */}
                  <p className="text-slate-500 text-xs leading-relaxed">
                    {n.content}
                  </p>
                </div>
                
                {/**<button className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition uppercase tracking-wider">
                  View Document →
                </button>*/}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-10 text-slate-400">
            <Info size={40} className="mb-2 opacity-20" />
            <p className="text-sm font-medium">No new notices at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;