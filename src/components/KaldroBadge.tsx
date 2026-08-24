import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
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
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0F172A]/80 hover:bg-[#0F172A] backdrop-blur-xl border border-white/15 hover:border-sky-400/40 text-slate-300 hover:text-white text-[11px] sm:text-xs font-semibold transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:scale-105 group"
      >
        <Sparkles className="w-3.5 h-3.5 text-sky-400 group-hover:text-amber-300 transition-colors animate-pulse" />
        <span>by <strong className="text-white font-bold group-hover:text-sky-400 transition-colors">Kaldro.es</strong></span>
        <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
      </a>
    </aside>
  );
};

