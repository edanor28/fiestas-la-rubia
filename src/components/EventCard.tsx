import React, { useRef } from 'react';
import { MapPin, Beer, Share2, Navigation, Sparkles, ExternalLink } from 'lucide-react';
import gsap from 'gsap';
import type { FiestaEvent } from '../data/events';

interface EventCardProps {
  event: FiestaEvent;
  className?: string;
}

interface SponsorContentProps {
  sponsor: FiestaEvent['sponsor'];
  isLink?: boolean;
}

const SponsorContent: React.FC<SponsorContentProps> = ({ sponsor, isLink }) => (
  <>
    <div className={`p-2 rounded-lg bg-amber-500/15 border border-amber-400/20 text-amber-400 shrink-0 ${isLink ? 'group-hover:scale-110 transition-transform' : ''}`}>
      <Beer className="w-5 h-5" />
    </div>
    <div className="flex flex-col gap-0.5 min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
          Patrocinador Oficial
        </span>
        <Sparkles className="w-3 h-3 text-amber-300" />
      </div>
      <p className={`text-sm font-bold text-slate-100 truncate ${isLink ? 'group-hover:text-sky-400 transition-colors' : ''}`}>
        {sponsor.name}
      </p>
      <p className="text-xs text-amber-200/90 font-medium leading-snug">
        {sponsor.promoText}
      </p>
    </div>
  </>
);

export const EventCard: React.FC<EventCardProps> = ({ event, className = '' }) => {
  const whatsappUrl = `https://api.whatsapp.com/send?text=${event.whatsappText}`;
  const cardRef = useRef<HTMLElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    gsap.to(cardRef.current, {
      duration: 0.4,
      rotateX,
      rotateY,
      transformPerspective: 1000,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    gsap.to(cardRef.current, {
      duration: 0.7,
      rotateX: 0,
      rotateY: 0,
      ease: "elastic.out(1, 0.3)"
    });
  };

  return (
    <div className="relative group w-full perspective-1000 lg:max-w-[420px] mx-auto">
      {/* Animated Neon Border */}
      <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-[#F43F5E] via-[#8B5CF6] to-[#38BDF8] opacity-30 group-hover:opacity-100 blur transition-opacity duration-500 animate-gradient-xy pointer-events-none hidden lg:block" />
      
      <article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        id={`event-card-${event.id}`}
        className={`relative w-full rounded-2xl bg-[#0F172A]/85 backdrop-blur-md border border-white/15 drop-shadow-2xl shadow-2xl p-5 text-white flex flex-col gap-4 overflow-y-auto lg:max-h-[calc(100vh-9rem)] scrollbar-hide transition-all duration-300 ${className}`}
      >
      {/* Glow highlight decorativo sutil superior */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#F43F5E]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#38BDF8]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header: Badge temporal & Fecha */}
      <header className="relative z-10 flex items-center justify-between gap-2 flex-wrap">
        <span
          id={`event-badge-${event.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F43F5E] text-white text-xs font-bold tracking-wide uppercase shadow-sm shadow-rose-900/40"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          {event.badge}
        </span>

        <span className="text-xs font-medium text-slate-300 tracking-tight">
          {event.date}
        </span>
      </header>

      {/* Título y Ubicación */}
      <section className="relative z-10 flex flex-col gap-1.5">
        <h3 className="text-xl sm:text-2xl font-black text-slate-50 leading-tight tracking-tight">
          {event.name}
        </h3>
        
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-300">
          <MapPin className="w-4 h-4 text-[#38BDF8] shrink-0" />
          <span className="font-medium truncate">{event.addressStreet}</span>
        </div>
      </section>

      {/* Descripción corta */}
      <p className="relative z-10 text-xs sm:text-sm text-slate-300 leading-relaxed">
        {event.description}
      </p>

      {/* Bloque de Patrocinio Exclusivo */}
      {event.sponsor.mapsUrl ? (
        <a
          id={`event-sponsor-${event.id}`}
          href={event.sponsor.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 bg-[#1E293B] rounded-xl p-3.5 border border-white/10 flex items-start gap-3 shadow-inner hover:bg-slate-800 transition-colors cursor-pointer group"
        >
          <SponsorContent sponsor={event.sponsor} isLink={true} />
        </a>
      ) : (
        <section
          id={`event-sponsor-${event.id}`}
          className="relative z-10 bg-[#1E293B] rounded-xl p-3.5 border border-white/10 flex items-start gap-3 shadow-inner"
        >
          <SponsorContent sponsor={event.sponsor} />
        </section>
      )}

      {/* Minigalería de Ediciones Anteriores */}
      <section className="relative z-10 flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
          Recuerdos de ediciones anteriores
        </span>
        <div className="grid grid-cols-3 gap-2">
          {event.pastPhotos.map((photoUrl, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-slate-800/80 group"
            >
              <img
                src={photoUrl}
                alt={`${event.name} recuerdo ${index + 1}`}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>
          ))}
        </div>
      </section>

      {/* Llamadas a la Acción (CTAs) */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center gap-2.5 pt-1">
        {/* Botón Primario: Google Maps GPS */}
        <a
          id={`btn-maps-${event.id}`}
          href={event.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#38BDF8] hover:bg-[#7dd3fc] active:bg-[#0284c7] text-[#0F172A] text-sm font-black shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Navigation className="w-4 h-4 fill-current" />
          <span>Abrir en Google Maps (GPS)</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>

        {/* Botón Secundario: Compartir en WhatsApp */}
        <a
          id={`btn-share-${event.id}`}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartir en WhatsApp"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Share2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="sm:hidden">Compartir plan</span>
        </a>
      </footer>
    </article>
    </div>
  );
};
