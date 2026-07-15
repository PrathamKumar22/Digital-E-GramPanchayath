import React, { useState, useEffect } from 'react'; // Added useEffect
import axios from 'axios'; // Added axios
import Hero from '../components/sections/Hero';
import NoticeBoard from '../components/sections/NoticeBoard';
import Footer from '../components/layout/Footer';
import { ClipboardList, Users, Landmark, CheckCircle2 } from 'lucide-react';

const Home = () => {
  // 1. Initialize as empty array to receive database data
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Fetch notices from your Backend API
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        // Replace with your actual backend URL
        const res = await axios.get('https://digital-e-grampanchayath-1.onrender.com/api/notices');
        setNotices(res.data);
      } catch (err) {
        console.error("Error fetching notices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Hero />

      {/* --- DISCOVER SECTION --- */}
      <section id="insights" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center overflow-visible">
            <div className="space-y-8 z-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-blue-900 uppercase leading-tight">
                  Your Gateway to <br/>
                  <span className="text-yellow-500">Digital Governance</span>
                </h2>
                <div className="h-2 w-20 bg-blue-900 rounded-full mt-4"></div>
              </div>

              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                Our Gram Panchayat is going digital to serve you better. This portal is designed 
                to eliminate long queues and bring all essential services directly to your mobile phone.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-2xl">
                  <div className="text-blue-700 font-bold bg-white p-2 rounded-lg shadow-sm">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">24/7 Service Access</h4>
                    <p className="text-sm text-slate-500">No need to wait for office hours.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: IMAGE LAYOUT */}
            <div className="relative h-[500px] w-full mt-10 md:mt-0">
              <div className="absolute inset-0 bg-blue-50 rounded-[3rem] -rotate-3 translate-x-4"></div>
              <div className="relative h-full w-full rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl z-10">
                <img 
                  src="/uploads/panchayath.jpg" 
                  alt="Digital App" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl z-20 border border-slate-100 min-w-[150px]">
                <p className="text-blue-900 font-black text-3xl">100%</p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Digital Literacy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- DYNAMIC NOTICE BOARD SECTION --- */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center py-10 text-slate-400 font-bold animate-pulse">
              LOADING LATEST NOTICES...
            </div>
          ) : (
            <NoticeBoard notices={notices} />
          )}
        </div>
      </section>

      {/* --- SERVICE GRID --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-blue-900 mb-4 uppercase">Our Services</h2>
          <p className="text-slate-500 font-medium">Modern solutions for every citizen.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-blue-500 transition-all shadow-xl hover:-translate-y-2">
            <div className="h-56 overflow-hidden">
              <img src="/uploads/certificate.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Docs" />
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 text-blue-600 mb-3 font-black text-xs uppercase tracking-widest">
                <ClipboardList size={18} /> Documentation
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">Apply for Certificates</h3>
              <p className="text-slate-500 text-sm mb-6">Get Income, Caste, or Residence certificates online.</p>
            </div>
          </div>

          <div className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-green-500 transition-all shadow-xl hover:-translate-y-2">
            <div className="h-56 overflow-hidden">
              <img src="/uploads/govtscheme.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Welfare" />
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 text-green-600 mb-3 font-black text-xs uppercase tracking-widest">
                <Users size={18} /> Welfare
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">Govt Schemes</h3>
              <p className="text-slate-500 text-sm mb-6">Explore housing and education subsidies.</p>
            </div>
          </div>

          <div className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-100 hover:border-orange-500 transition-all shadow-xl hover:-translate-y-2">
            <div className="h-56 overflow-hidden">
              <img src="/uploads/villageprogress.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Dev" />
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 text-orange-600 mb-3 font-black text-xs uppercase tracking-widest">
                <Landmark size={18} /> Development
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800">Village Progress</h3>
              <p className="text-slate-500 text-sm mb-6">Track new infrastructure projects.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- QUICK BENEFITS --- */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <CheckCircle2 size={48} className="text-yellow-400 mb-4" />
            <h4 className="text-xl font-bold">Transparent</h4>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle2 size={48} className="text-yellow-400 mb-4" />
            <h4 className="text-xl font-bold">Secure</h4>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle2 size={48} className="text-yellow-400 mb-4" />
            <h4 className="text-xl font-bold">Efficient</h4>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;