import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-xl font-black mb-4 uppercase">Panchayat Portal</h3>
          <p className="text-slate-400 text-sm">Empowering our village through digital excellence and transparency.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="text-slate-400 space-y-2 text-sm">
            <li>About Panchayat</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Contact</h4>
          <p className="text-slate-400 text-sm">Main Office: Gram Panchayat Bhawan</p>
          <p className="text-slate-400 text-sm">Support: support@village.gov</p>
        </div>
      </div>
      <div className="border-t border-slate-800 mt-10 pt-6 text-center text-slate-500 text-xs">
        © 2026 Digital E-Gram Panchayat. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;