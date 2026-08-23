import React, { forwardRef } from 'react';
import { ChevronDown, Map, Sparkles } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

export const HeroOverlay = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div 
      ref={ref}
      data-testid="hero-overlay"
      className="absolute inset-0 flex flex-col items-center justify-center z-30 transition-opacity duration-75"
    >
      <div className="text-center px-4 max-w-3xl mx-auto flex flex-col items-center gap-5 mt-10 sm:mt-0 lg:-mt-16">
        
        {/* Badge */}
        <div data-testid="hero-badge" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E293B]/80 backdrop-blur-md border border-white/10 text-white text-sm font-semibold shadow-2xl">
          <Map className="w-4 h-4 text-[#38BDF8]" />
          <span>Experiencia 3D Interactiva</span>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
        
        {/* Título Principal */}
        <h2 data-testid="hero-title" className="text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tighter leading-[1.1] drop-shadow-sm">
          Fiestas de <br className="sm:hidden" />
          <span className="text-[#F43F5E] bg-none">La Rubia</span> 2026
        </h2>
        
        {/* Subtítulo */}
        <p data-testid="hero-subtitle" className="text-slate-300 text-sm sm:text-base md:text-lg max-w-xl font-medium leading-relaxed drop-shadow-md">
          Acompaña el recorrido de los eventos desde el espacio hasta nuestra calle. 
        </p>

        {/* Cuenta Atrás en Tiempo Real */}
        <div className="pt-1">
          <CountdownTimer />
        </div>
      </div>

      {/* Flecha Scroll */}
      <div data-testid="hero-scroll-indicator" className="absolute bottom-24 sm:bottom-16 flex flex-col items-center gap-3 animate-bounce">
        <span className="text-white/80 text-xs sm:text-sm uppercase tracking-[0.3em] font-bold drop-shadow-md">
          Haz scroll para descubrir
        </span>
        <ChevronDown className="w-8 h-8 text-[#F43F5E] drop-shadow-lg" />
      </div>
    </div>
  );
});
