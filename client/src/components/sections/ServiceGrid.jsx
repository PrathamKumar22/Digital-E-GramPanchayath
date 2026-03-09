import React from 'react';
import Card from '../ui/Card';
import { FileText, ShieldCheck, Globe } from 'lucide-react';

const ServiceGrid = () => {
  const services = [
    { title: "E-Certificates", icon: <FileText className="text-blue-600" />, desc: "Apply for Caste, Income, and Birth documents instantly.", color: "bg-blue-50" },
    { title: "Govt Schemes", icon: <ShieldCheck className="text-green-600" />, desc: "Browse and apply for the latest welfare schemes.", color: "bg-green-50" },
    { title: "Community Hub", icon: <Globe className="text-purple-600" />, desc: "Stay updated with Gram Sabha news and events.", color: "bg-purple-50" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {services.map((s, i) => (
        <Card key={i} className="group cursor-pointer hover:-translate-y-2">
          <div className={`${s.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6`}>{s.icon}</div>
          <h3 className="text-xl font-bold mb-3">{s.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
        </Card>
      ))}
    </div>
  );
};

export default ServiceGrid;