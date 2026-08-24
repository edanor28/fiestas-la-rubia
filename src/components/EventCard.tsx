import React, { useRef, useState } from 'react';
import { MapPin, Beer, Navigation, Sparkles, ExternalLink, CalendarPlus, Check } from 'lucide-react';
import gsap from 'gsap';
import type { FiestaEvent } from '../data/events';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { triggerHaptic } from '../utils/haptics';

interface EventCardProps {
  event: FiestaEvent;
  className?: string;
}

interface SponsorContentProps {
  sponsor: FiestaEvent['sponsor'];
  isLink?: boolean;
}

// Icono Oficial de WhatsApp
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg 
    viewBox="0 0 24 24" 
    width="16" 
    height="16" 
    fill="currentColor" 
    className={`shrink-0 ${className}`}
  >
    <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.276-.1-.476-.15-.676.15-.2.3-.776.979-.951 1.179-.175.2-.351.225-.652.075-.301-.15-1.27-.468-2.42-1.494-.895-.798-1.5-1.783-1.675-2.083-.175-.3-.019-.462.131-.611.136-.134.301-.35.451-.525.15-.175.2-.3.301-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-.926-2.23-.244-.585-.492-.506-.676-.515-.175-.008-.376-.01-.576-.01-.2 0-.526.075-.802.375-.276.3-1.052 1.028-1.052 2.508 0 1.48 1.077 2.91 1.227 3.11.15.2 2.12 3.238 5.136 4.54 2.708 1.17 2.708.78 3.195.733.488-.047 1.57-.642 1.793-1.264.223-.622.223-1.155.156-1.265-.067-.11-.267-.185-.568-.335zM12 2a9.93 9.93 0 0 0-8.522 15.02L2 22l5.127-1.344A9.933 9.933 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2a8.17 8.17 0 0 1-4.17-1.144l-.299-.178-3.097.812.826-3.018-.195-.31A8.2 8.2 0 1 1 12 20.2z"/>
  </svg>
);

const SponsorContent: React.FC<SponsorContentProps> = ({ sponsor, isLink }) => (
  <>
    <div className={`p-1.5 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-400 shrink-0 ${isLink ? 'group-hover:scale-110 transition-transform' : ''}`}>
      <Beer className="w-4 h-4" />
    </div>
    <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
          Patrocinador Oficial
        </span>
        <Sparkles className="w-3 h-3 text-amber-300" />
      </div>
      <p className={`text-xs sm:text-sm font-bold text-slate-100 truncate ${isLink ? 'group-hover:text-sky-400 transition-colors' : ''}`}>
        {sponsor.name}
      </p>
      <p className="text-[11px] text-amber-200/90 font-medium leading-snug">
        {sponsor.promoText}
      </p>
    </div>
  </>
);

export const EventCard: React.FC<EventCardProps> = ({ event, className = '' }) => {
  const whatsappUrl = `https://api.whatsapp.com/send?text=${event.whatsappText}`;
  const googleCalUrl = generateGoogleCalendarUrl(event);
  const cardRef = useRef<HTMLElement>(null);
  const [copiedIcs, setCopiedIcs] = useState(false);

  const handleDownloadIcs = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerHaptic('success');
    downloadIcsFile(event);
    setCopiedIcs(true);
    setTimeout(() => setCopiedIcs(false), 2500);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    gsap.to(cardRef.current, {
      duration: 0.35,
      rotateX,
      rotateY,
      transformPerspective: 1000,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || window.innerWidth < 1024) return;
    gsap.to(cardRef.current, {
      duration: 0.6,
      rotateX: 0,
      rotateY: 0,
      ease: "elastic.out(1, 0.3)"
    });
  };

  return (
    <div className="relative group w-full perspective-1000">
      {/* Borde Neón Multicolor Permanente y Vibrante */}
      <div className="absolute -inset-1 rounded-[1.85rem] bg-gradient-to-r from-[#F43F5E] via-[#8B5CF6] to-[#38BDF8] opacity-80 group-hover:opacity-100 blur-sm sm:blur-md transition-opacity duration-500 animate-gradient-xy pointer-events-none" />
      
      <article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        id={`event-card-${event.id}`}
        data-testid="event-card"
        data-event-id={event.id}
        className={`relative w-full rounded-3xl bg-[#0F172A]/95 backdrop-blur-2xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] p-3.5 sm:p-5 text-white flex flex-col gap-2 sm:gap-3 max-h-[calc(100vh-11rem)] sm:max-h-[calc(100vh-9rem)] overflow-y-auto scrollbar-hide transition-all duration-300 ${className}`}
      >
        {/* Header: Badge temporal & Fecha */}
        <header className="relative z-10 flex items-center justify-between gap-2 flex-wrap">
          <span
            id={`event-badge-${event.id}`}
            data-testid="event-badge"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F43F5E] text-white text-[11px] font-bold tracking-wide uppercase shadow-sm shadow-rose-900/40"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {event.badge}
          </span>

          <span data-testid="event-date" className="text-xs font-semibold text-slate-300 tracking-tight">
            {event.date}
          </span>
        </header>

        {/* Título y Ubicación */}
        <section className="relative z-10 flex flex-col gap-1">
          <h3 data-testid="event-title" className="text-base sm:text-lg font-black text-slate-50 leading-snug tracking-tight">
            {event.name}
          </h3>
          
          <div className="flex items-center gap-1.5 text-xs text-sky-300">
            <MapPin className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
            <span data-testid="event-address" className="font-medium truncate">{event.addressStreet}</span>
          </div>
        </section>

        {/* Descripción */}
        <p data-testid="event-description" className="relative z-10 text-xs text-slate-300 leading-relaxed">
          {event.description}
        </p>

        {/* Bloque de Patrocinio Exclusivo */}
        {event.sponsor.mapsUrl ? (
          <a
            id={`event-sponsor-${event.id}`}
            data-testid="event-sponsor"
            href={event.sponsor.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic('light')}
            className="relative z-10 bg-slate-900/80 rounded-xl p-2.5 border border-white/10 flex items-start gap-2.5 shadow-inner hover:bg-slate-800 transition-colors cursor-pointer group"
          >
            <SponsorContent sponsor={event.sponsor} isLink={true} />
          </a>
        ) : (
          <section
            id={`event-sponsor-${event.id}`}
            data-testid="event-sponsor"
            className="relative z-10 bg-slate-900/80 rounded-xl p-2.5 border border-white/10 flex items-start gap-2.5 shadow-inner"
          >
            <SponsorContent sponsor={event.sponsor} />
          </section>
        )}

        {/* Minigalería de Ediciones Anteriores */}
        {event.pastPhotos.length > 0 && (
          <section data-testid="event-past-photos" className="relative z-10 flex flex-col gap-1">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">
              Recuerdos de ediciones anteriores
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {event.pastPhotos.map((photoUrl, index) => (
                <div
                  key={index}
                  className="relative h-14 sm:h-16 rounded-lg overflow-hidden border border-white/10 bg-slate-800 group"
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
        )}

        {/* Llamadas a la Acción (CTAs) */}
        <footer className="relative z-10 flex flex-col gap-2 pt-1">
          {/* Fila Primaria: Google Maps GPS & WhatsApp Oficial */}
          <div className="flex items-center gap-2">
            {/* Botón Primario: Google Maps GPS */}
            <a
              id={`btn-maps-${event.id}`}
              data-testid="btn-maps"
              href={event.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic('light')}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#38BDF8] hover:bg-[#7dd3fc] active:bg-[#0284c7] text-[#0F172A] text-xs sm:text-sm font-black shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Navigation className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="truncate">Abrir en Google Maps</span>
              <ExternalLink className="w-3 h-3 opacity-70 shrink-0 hidden sm:inline" />
            </a>

            {/* Botón Oficial de WhatsApp */}
            <a
              id={`btn-share-${event.id}`}
              data-testid="btn-share-whatsapp"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Compartir en WhatsApp"
              onClick={() => triggerHaptic('light')}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 sm:px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1caa52] text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Fila Secundaria: Añadir a Calendario (Google Calendar & Apple .ics) */}
          <div className="flex items-center gap-2">
            <a
              data-testid="btn-google-calendar"
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => triggerHaptic('light')}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-semibold transition-colors"
            >
              <CalendarPlus className="w-3 h-3 text-sky-400" />
              <span>Google Calendar</span>
            </a>

            <button
              data-testid="btn-apple-calendar"
              onClick={handleDownloadIcs}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[11px] font-semibold transition-colors"
            >
              {copiedIcs ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Descargado</span>
                </>
              ) : (
                <>
                  <CalendarPlus className="w-3 h-3 text-rose-400" />
                  <span>Apple / iCal</span>
                </>
              )}
            </button>
          </div>
        </footer>
      </article>
    </div>
  );
};
