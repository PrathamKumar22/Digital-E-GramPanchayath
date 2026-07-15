import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Check, X, User, ShieldCheck, ArrowLeft, Eye, Image as ImageIcon, Maximize2, Upload, FileCheck } from 'lucide-react';

const AdminCertificates = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://digital-e-grampanchayath-1.onrender.com/api/requests/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setRequests(response.data.requests);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://digital-e-grampanchayath-1.onrender.com/api/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setSelectedRequest(response.data.request);
    } catch (error) {
      alert("Could not load details");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      // 1. Validation for approval
      if (newStatus === 'Approved' && !certificateFile) {
        alert("Please select a certificate file (PDF) to upload before approving.");
        return;
      }

      // 2. Build FormData
      const formData = new FormData();
      formData.append('status', newStatus);
      
      if (certificateFile) {
        // 'certificate' matches the upload.single('certificate') in backend
        formData.append('certificate', certificateFile);
      }

      // 3. API Call
      const response = await axios.put(`https://digital-e-grampanchayath-1.onrender.com/api/requests/${id}/status`, 
        formData,
        { headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }}
      );

      if (response.data.success) {
        alert(`✅ Request ${newStatus} Successfully!`);
        setSelectedRequest(null);
        setCertificateFile(null);
        fetchRequests(); // Refresh the main table
      }
    } catch (error) {
      console.error("Status Update Error:", error.response?.data || error.message);
      alert("Failed to update status: " + (error.response?.data?.message || "Server connection error"));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 uppercase font-black tracking-widest text-blue-900">
      Syncing Queue...
    </div>
  );

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen relative">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @keyframes bounce-subtle { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .group:hover .bounce { animation: bounce-subtle 0.6s infinite; }
      `}</style>

      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/admin-dashboard')} className="mb-8 flex items-center gap-2 text-slate-400 font-bold hover:text-blue-900 transition-all">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <h1 className="text-3xl font-black text-blue-900 mb-8 uppercase flex items-center gap-3">
          <div className="bg-blue-900 p-2 rounded-lg text-white shadow-lg"><ShieldCheck size={24} /></div>
          Approval Queue
        </h1>

        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
          <div className="max-h-[650px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white z-10 shadow-sm border-b">
                <tr className="text-slate-400 text-[10px] font-black uppercase">
                  <th className="p-8">Citizen</th>
                  <th className="p-8">Type</th>
                  <th className="p-8">Status</th>
                  <th className="p-8 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-blue-50/20">
                    <td className="p-8 font-bold text-slate-800">{req.userId?.name || "Citizen"}</td>
                    <td className="p-8 font-bold text-slate-600">{req.serviceType}</td>
                    <td className="p-8">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        req.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 
                        req.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>{req.status}</span>
                    </td>
                    <td className="p-8 flex justify-center gap-2">
                      <button onClick={() => handleViewDetails(req._id)} className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- DETAILS MODAL --- */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-black text-blue-900 uppercase tracking-tight">Application Details</h2>
              <button onClick={() => {setSelectedRequest(null); setCertificateFile(null);}} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-red-500"><X size={24}/></button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Submitted Information</h3>
                <div className="space-y-4">
                  {Object.entries(selectedRequest.data || {}).map(([key, val]) => (
                    <div key={key} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="font-bold text-slate-800">{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Documents Provided</h3>
                <div className="grid grid-cols-1 gap-4">
                  {selectedRequest.attachments?.map((img, index) => (
                    <div key={index} className="group relative rounded-2xl overflow-hidden border-2 border-slate-100 cursor-pointer" onClick={() => setPreviewImage(img)}>
                      <img src={img} alt="Document" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300">
                         <Maximize2 className="text-white mb-2" size={32} />
                         <span className="text-white text-[10px] font-black uppercase tracking-widest">Click to Zoom</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="w-full md:w-auto">
                    <label className="flex items-center gap-3 px-6 py-3 bg-white border-2 border-dashed border-blue-200 rounded-2xl cursor-pointer hover:border-blue-500 transition-all group">
                        <Upload size={20} className="text-blue-500 bounce" />
                        <div>
                            <p className="text-xs font-black text-slate-700 uppercase truncate max-w-[200px]">{certificateFile ? certificateFile.name : "Choose Certificate PDF"}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Ready for issuance</p>
                        </div>
                        <input type="file" className="hidden" accept=".pdf" onChange={(e) => setCertificateFile(e.target.files[0])} />
                    </label>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => handleStatusUpdate(selectedRequest._id, 'Rejected')} className="px-8 py-3 bg-red-100 text-red-600 rounded-xl font-black uppercase text-xs hover:bg-red-600 hover:text-white transition-all">Reject</button>
                    <button onClick={() => handleStatusUpdate(selectedRequest._id, 'Approved')} className="flex items-center gap-2 px-8 py-3 bg-green-500 text-white rounded-xl font-black uppercase text-xs hover:bg-green-600 shadow-lg shadow-green-200 transition-all">
                        <FileCheck size={16}/> Approve & Issue
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* --- IMAGE LIGHTBOX PREVIEW --- */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-8 cursor-zoom-out animate-in fade-in duration-300" onClick={() => setPreviewImage(null)}>
          <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"><X size={48} /></button>
          <img src={previewImage} alt="Enlarged Document" className="max-w-full max-h-full rounded-lg shadow-2xl object-contain border border-white/10" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};

export default AdminCertificates;