import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Download, Clock, ArrowLeft, Search, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApprovedRecords();
  }, []);

  const fetchApprovedRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://digital-e-grampanchayath-1.onrender.com/api/requests/my-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Only show records that are "Approved" and have a certificate issued
        const approvedOnly = response.data.requests.filter(req => req.status === 'Approved');
        setRecords(approvedOnly);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching records:", error);
      setLoading(false);
    }
  };

  const handleDownload = (id) => {
    // This opens the backend download route in a new tab
    const token = localStorage.getItem('token');
    window.open(`https://digital-e-grampanchayath-1.onrender.com/api/requests/download/${id}?token=${token}`, '_blank');
  };

  const filteredRecords = records.filter(record =>
    record.serviceType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 uppercase font-black text-blue-900">
      Loading Records...
    </div>
  );

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="mb-8 flex items-center gap-2 text-slate-400 font-bold hover:text-blue-900 transition-all">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-blue-900 uppercase flex items-center gap-3">
              <div className="bg-green-500 p-2 rounded-lg text-white shadow-lg"><ShieldCheck size={24} /></div>
              My Digital Records
            </h1>
            <p className="text-slate-400 font-bold text-sm mt-1">Access and download your verified village certificates.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search records..."
              className="pl-12 pr-6 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 w-full md:w-80 font-bold text-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText size={40} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-800 uppercase">No records found</h3>
            <p className="text-slate-400 font-bold mt-2">Approved certificates will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map((record) => (
              <div key={record._id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl hover:shadow-2xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FileText size={28} />
                  </div>
                  <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Verified
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-800 uppercase mb-2 leading-tight">
                  {record.serviceType}
                </h3>
                
                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs mb-8 uppercase tracking-tighter">
                  <Clock size={14} />
                  Issued on: {new Date(record.updatedAt).toLocaleDateString()}
                </div>

                <button 
                  onClick={() => handleDownload(record._id)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-blue-600 shadow-lg shadow-slate-200 transition-all"
                >
                  <Download size={18} />
                  Download Certificate
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRecords;