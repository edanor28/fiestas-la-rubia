import React, { useState } from 'react';
import { Calendar, Phone, Sun, Moon } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const NavBar: React.FC = () => {
  const [isNightMode, setIsNightMode] = useState(true);

  const toggleTheme = () => {
    triggerHaptic('light');
    const nextMode = !isNightMode;
    setIsNightMode(nextMode);
    window.dispatchEvent(new CustomEvent('mapThemeChange', { detail: { isNight: nextMode } }));
  };

  return (
    <nav data-testid="navbar" className="fixed top-0 left-0 w-full z-50 px-4 py-3 sm:px-6 sm:py-4">
      <div className="max-w-7xl mx-auto bg-[#0F172A]/70 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between shadow-lg">
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

        <div className="flex items-center gap-2">
          {/* Alternador Modo Día / Noche */}
          <button
            onClick={toggleTheme}
            data-testid="theme-toggle-btn"
            aria-label={isNightMode ? 'Cambiar a modo día' : 'Cambiar a modo noche'}
            title={isNightMode ? 'Modo Fiesta Nocturna activo' : 'Modo Tardeo Soleado activo'}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/10 transition-all text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 border border-white/5 shadow-sm"
          >
            {isNightMode ? (
              <>
                <Moon className="w-4 h-4 text-sky-400" />
                <span className="hidden md:inline text-xs">Noche</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline text-xs">Día</span>
              </>
            )}
          </button>

          {/* Botón Contacto */}
          <a
            href="mailto:vecinoslarubia@gmail.com?subject=Consulta%20Fiestas%20La%20Rubia%202026"
            onClick={() => triggerHaptic('light')}
            data-testid="navbar-contact-btn"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/10 transition-all text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2.5 rounded-xl border border-white/5"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Contacto</span>
          </a>
        </div>
      </div>
    </nav>
  );
};
