import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Upload, ShieldCheck, FileCheck, Lightbulb, MessageSquare } from 'lucide-react';
import axios from 'axios';

const serviceConfigs = {
  income: {
    title: "Income Certificate",
    fields: [
      { id: "fatherName", label: "Father/Husband Name", type: "text", placeholder: "Enter full name" },
      { id: "annualIncome", label: "Total Family Annual Income (₹)", type: "number", placeholder: "e.g. 120000" },
      { id: "source", label: "Source of Income", type: "text", placeholder: "e.g. Farming, Business" }
    ],
    requiredDocs: [
      { id: "aadhar", label: "Aadhar Card (Front & Back)" },
      { id: "ration", label: "Ration Card / BPL Card" },
      { id: "declaration", label: "Self Declaration Form" }
    ]
  },
  "street-light": {
    title: "Street Light Repair Request",
    fields: [
      { id: "poleNo", label: "Pole Number / ID", type: "text", placeholder: "Mention the number on the pole" },
      { id: "landmark", label: "Nearest Landmark", type: "text", placeholder: "e.g. Near Village Temple" },
      { id: "issueType", label: "Issue Type", type: "text", placeholder: "e.g. Light not working" }
    ],
    requiredDocs: [
      { id: "photo", label: "Photo of Faulty Light/Pole" },
      { id: "idproof", label: "Aadhar Card" }
    ]
  },
  "other-service": {
    title: "General Panchayat Service",
    fields: [
      { id: "subject", label: "Subject of Request", type: "text", placeholder: "e.g. Drainage, Road, Cleaning" },
      { id: "wardNo", label: "Ward Number", type: "text", placeholder: "Enter your ward number" }
    ],
    requiredDocs: [
      { id: "aadhar", label: "Aadhar Card" },
      { id: "proof", label: "Supporting Photo/Doc (Optional)" }
    ]
  },
  scholarship: {
    title: "Village Scholarship Request",
    fields: [
      { id: "college", label: "College/School Name", type: "text", placeholder: "Enter institution name" },
      { id: "marks", label: "Previous Year Percentage (%)", type: "number", placeholder: "e.g. 85" }
    ],
    requiredDocs: [
      { id: "marksheet", label: "Previous Year Marksheet" },
      { id: "studentId", label: "Student ID Card" }
    ]
  },
  caste: {
    title: "Caste Certificate",
    fields: [
      { id: "casteName", label: "Caste/Community Name", type: "text", placeholder: "e.g. OBC, SC, ST" },
      { id: "religion", label: "Religion", type: "text", placeholder: "e.g. Hindu, Muslim" },
      { id: "fatherCaste", label: "Father's Caste", type: "text", placeholder: "As per school records" }
    ],
    requiredDocs: [
      { id: "aadhar", label: "Aadhar Card" },
      { id: "lc", label: "School Leaving Certificate" },
      { id: "fatherProof", label: "Father's Caste Proof" }
    ]
  },
  residence: {
    title: "Residence/Domicile Certificate",
    fields: [
      { id: "stayDuration", label: "Years of Residence", type: "number", placeholder: "e.g. 15" },
      { id: "houseNo", label: "House Number / Ward", type: "text", placeholder: "e.g. Ward No. 4" }
    ],
    requiredDocs: [
      { id: "aadhar", label: "Aadhar Card" },
      { id: "voter", label: "Voter ID Card" },
      { id: "bill", label: "Electricity Bill" }
    ]
  },
  water: {
    title: "New Water Connection",
    fields: [
      { id: "connectionType", label: "Connection Type", type: "text", placeholder: "Domestic or Commercial" },
      { id: "members", label: "Total Family Members", type: "number", placeholder: "Number of people" }
    ],
    requiredDocs: [
      { id: "aadhar", label: "Aadhar Card" },
      { id: "propertyTax", label: "Property Tax Receipt" }
    ]
  },
  pension: {
    title: "Old Age Pension",
    fields: [
      { id: "age", label: "Current Age", type: "number", placeholder: "Must be 60+" },
      { id: "bankAcc", label: "Bank Account Number", type: "text", placeholder: "For direct benefit transfer" },
      { id: "ifsc", label: "IFSC Code", type: "text", placeholder: "Bank branch code" }
    ],
    requiredDocs: [
      { id: "aadhar", label: "Aadhar Card" },
      { id: "passbook", label: "Bank Passbook" },
      { id: "ageProof", label: "Age Proof Certificate" }
    ]
  },
  "house-tax": {
    title: "Property Tax Assessment",
    fields: [
      { id: "propertyId", label: "Existing Property ID", type: "text", placeholder: "e.g. P-102-B" },
      { id: "area", label: "Built-up Area (Sq. Ft)", type: "number", placeholder: "e.g. 1200" }
    ],
    requiredDocs: [
      { id: "ownership", label: "Ownership Document" },
      { id: "taxReceipt", label: "Old Tax Receipt" }
    ]
  }
};

const ApplyCertificate = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const config = serviceConfigs[serviceId] || serviceConfigs.income;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [attachments, setAttachments] = useState({});

  const handleInputChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (docId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachments(prev => ({ ...prev, [docId]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Custom Validation: 'other-service' only requires Aadhar, others require all.
    const uploadedCount = Object.keys(attachments).length;
    const requiredCount = config.requiredDocs.length;
    
    if (serviceId !== 'other-service' && uploadedCount < requiredCount) {
      alert("Please upload all required documents before submitting.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Sending payload in the format the backend expects
      await axios.post('http://localhost:5000/api/requests/apply', {
        serviceType: config.title,
        data: formData, // All text fields including 'reason'
        attachments: Object.values(attachments) // Array of Base64 strings
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Application Submitted Successfully!");
      navigate('/dashboard');
    } catch (err) {
      console.error("Submission error:", err.response?.data);
      alert("Error: " + (err.response?.data?.error || "Server connection failed"));
    } finally {
      setLoading(false);
    }
  };

  const getHeaderIcon = () => {
    switch (serviceId) {
      case 'street-light': return <Lightbulb size={32} />;
      case 'other-service': return <MessageSquare size={32} />;
      default: return <ShieldCheck size={32} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/services')}
          className="mb-8 flex items-center gap-2 text-slate-400 font-bold hover:text-blue-600 transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Services
        </button>

        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-50">
          <div className="flex items-center gap-5 mb-10 border-b border-slate-50 pb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-100">
              {getHeaderIcon()}
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
                {config.title}
              </h1>
              <p className="text-blue-600 text-xs font-black uppercase tracking-[0.2em] mt-2">
                Digital Gram Panchayat
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    required
                    placeholder={field.placeholder}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-700"
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                {serviceId === 'other-service' ? "Detailed Description" : "Reason for Application"}
              </label>
              <textarea
                required
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium text-slate-700 min-h-[100px]"
                placeholder={serviceId === 'other-service' ? "Explain your requirement..." : "Briefly explain why you need this service..."}
                onChange={(e) => handleInputChange('reason', e.target.value)}
              />
            </div>

            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                <FileCheck size={16} className="text-blue-600" /> Required Documentation
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {config.requiredDocs.map((doc) => (
                  <div key={doc.id} className="relative group">
                    <input 
                      type="file" 
                      required={serviceId !== 'other-service' || doc.id === 'aadhar'} 
                      onChange={(e) => handleFileChange(doc.id, e)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`w-full h-36 border-2 border-dashed rounded-[2rem] p-4 flex flex-col items-center justify-center text-center transition-all ${
                      attachments[doc.id] ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 group-hover:border-blue-400 group-hover:bg-blue-50/50'
                    }`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                        attachments[doc.id] ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300'
                      }`}>
                        <Upload size={20} />
                      </div>
                      <p className={`text-[10px] font-black uppercase leading-tight px-2 ${
                        attachments[doc.id] ? 'text-emerald-600' : 'text-slate-500'
                      }`}>
                        {attachments[doc.id] ? "File Ready ✓" : doc.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-6 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:bg-slate-200"
            >
              {loading ? "Submitting..." : (
                <>Submit Official Application <Send size={18} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyCertificate;