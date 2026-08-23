import React from 'react';
import { Calendar, Phone } from 'lucide-react';

export const NavBar: React.FC = () => {
  return (
    <nav data-testid="navbar" className="fixed top-0 left-0 w-full z-50 px-4 py-3 sm:px-6 sm:py-4">
      <div className="max-w-7xl mx-auto bg-[#0F172A]/70 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-[#F43F5E] p-2 rounded-xl text-white shadow-lg shadow-[#F43F5E]/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h1 data-testid="navbar-title" className="text-white font-bold text-sm sm:text-base leading-tight tracking-tight">
              Asociación Vecinal
            </h1>
            <p className="text-slate-400 text-xs font-medium tracking-wide">
              La Rubia, Valladolid
            </p>
          </div>
        </div>
        <button data-testid="navbar-contact-btn" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/10 transition-all text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl border border-white/5">
          <Phone className="w-4 h-4" />
          <span className="hidden sm:inline">Contacto</span>
        </button>
      </div>
    </nav>
  );
};
