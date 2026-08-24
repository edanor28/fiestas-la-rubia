import React from 'react';
import { ExternalLink } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const KaldroBadge: React.FC = () => {
  return (
    <aside
      data-testid="kaldro-badge"
      aria-label="Firma de autoría del desarrollador"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40"
    >
      <a
        href="https://kaldro.es"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Sitio web de Kaldro.es - Estudio de desarrollo"
        onClick={() => triggerHaptic('light')}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F172A]/85 hover:bg-[#0F172A] backdrop-blur-xl border border-white/15 hover:border-[#34E0E0]/50 text-slate-300 hover:text-white text-[11px] sm:text-xs font-semibold transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_30px_rgba(52,224,224,0.25)] hover:scale-105 group"
      >
        {/* Icono Oficial Kaldro */}
        <div className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform duration-300">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1092 1092"
            className="w-full h-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="kaldroBadgeArrowGrad" gradientUnits="userSpaceOnUse" x1="420" y1="590" x2="780" y2="220">
                <stop offset="0%" stopColor="#15B6C0"/>
                <stop offset="33%" stopColor="#34E0E0"/>
                <stop offset="100%" stopColor="#34E0E0"/>
              </linearGradient>
            </defs>

            {/* Top left square ring */}
            <path fill="#EAF4F6" fillRule="evenodd" d="M295 287H396V385H295Z M321 312H371V361H321Z"/>
            {/* Left vertical stem */}
            <rect x="332" y="384" width="28" height="295" fill="#EAF4F6"/>
            {/* Bottom left square with cyan inset */}
            <rect x="295" y="679" width="101" height="101" fill="#EAF4F6"/>
            <rect x="321" y="704" width="52" height="52" fill="#34E0E0"/>

            {/* Upper inner arm */}
            <path fill="#EAF4F6" d="M390 423H456L473 458L436 496L390 548Z"/>

            {/* Lower connector */}
            <path fill="#EAF4F6" d="M409 725H540L586 770H667V792H578L533 748H409Z"/>

            {/* Lower right arm */}
            <path fill="#EAF4F6" d="M563 534L512 588L687 769V834H799V725H748Z"/>

            {/* Cyan arrow */}
            <path fill="url(#kaldroBadgeArrowGrad)" d="M389 580V638H437L736 315L768 345L797 196L643 236L683 266L389 580Z"/>
          </svg>
        </div>

        <span>by <strong className="text-white font-bold group-hover:text-[#34E0E0] transition-colors">Kaldro.es</strong></span>
        <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:text-[#34E0E0] transition-all" />
      </a>
    </aside>
  );
};
