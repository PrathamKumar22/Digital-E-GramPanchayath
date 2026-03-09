import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, Home, Heart, 
  Zap, Droplets, GraduationCap, ChevronRight, MessageSquare 
} from 'lucide-react';

const ServiceSelection = () => {
  const navigate = useNavigate();

  const services = [
    {
      category: "Certificates & Identity",
      items: [
        { id: 'income', name: 'Income Certificate', icon: FileText, color: 'bg-blue-500' },
        { id: 'caste', name: 'Caste Certificate', icon: FileText, color: 'bg-indigo-500' },
        { id: 'residence', name: 'Residence/Domicile', icon: Home, color: 'bg-emerald-500' },
      ]
    },
    {
      category: "Utilities & Housing",
      items: [
        { id: 'water', name: 'New Water Connection', icon: Droplets, color: 'bg-sky-500' },
        // FIXED ID: Changed 'electricity' to 'street-light' to match the config
        { id: 'street-light', name: 'Street Light Repair', icon: Zap, color: 'bg-amber-500' },
        { id: 'house-tax', name: 'Property Tax Assessment', icon: Home, color: 'bg-rose-500' },
      ]
    },
    {
      category: "Welfare & Education",
      items: [
        { id: 'pension', name: 'Old Age Pension', icon: Heart, color: 'bg-pink-500' },
        { id: 'scholarship', name: 'Village Scholarship', icon: GraduationCap, color: 'bg-violet-500' },
        // NEW ITEM: Added General Help/Other Service
        { id: 'other-service', name: 'General Help / Other', icon: MessageSquare, color: 'bg-slate-600' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate('/dashboard')}
          className="mb-8 flex items-center gap-2 text-slate-400 font-bold hover:text-blue-600 transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Dashboard
        </button>

        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Village Services</h1>
          <p className="text-slate-500 font-medium mt-2">Select a service to start your digital application</p>
        </div>

        <div className="space-y-12">
          {services.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-2">
                {section.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/apply/${item.id}`)}
                    className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`${item.color} p-4 rounded-2xl text-white shadow-lg`}>
                        <item.icon size={24} />
                      </div>
                      <span className="font-bold text-slate-700 leading-tight">{item.name}</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;