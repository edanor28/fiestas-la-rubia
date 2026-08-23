import React from 'react';
import { Disc, Utensils, Music, Waves } from 'lucide-react';
import type { FiestaEvent } from '../data/events';
import { triggerHaptic } from '../utils/haptics';

interface EventTimelineProps {
  events: FiestaEvent[];
  activeEventIndex: number;
}

const EVENT_ICONS = [
  Disc,     // Evento 1: Discomóvil
  Utensils, // Evento 2: Paella
  Music,    // Evento 3: Rock
  Waves,    // Evento 4: Espuma
];

const EVENT_SHORT_NAMES = [
  'Vie 22 · Disco',
  'Sáb 23 · Paella',
  'Sáb 23 · Rock',
  'Dom 24 · Espuma',
];

export const EventTimeline: React.FC<EventTimelineProps> = ({ events, activeEventIndex }) => {
  const handleSelectEvent = (index: number) => {
    triggerHaptic('medium');

    // Cada evento ocupa 150vh en el contenedor total.
    // La fase activa (Hold) está entre 0.2 y 0.8 del evento (punto medio ~0.5).
    const vh = window.innerHeight;
    const targetScroll = (index + 0.5) * (vh * 1.5);

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <nav
      data-testid="event-timeline"
      aria-label="Selector rápido de eventos de fiestas"
      className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-40 max-w-[95vw] sm:max-w-max px-2 py-1.5 rounded-full bg-[#0F172A]/80 backdrop-blur-xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-hide"
    >
      {events.map((ev, index) => {
        const isActive = activeEventIndex === index;
        const IconComponent = EVENT_ICONS[index % EVENT_ICONS.length] || Disc;
        const shortName = EVENT_SHORT_NAMES[index] || ev.name;

        return (
          <button
            key={ev.id}
            onClick={() => handleSelectEvent(index)}
            data-testid={`timeline-pill-${ev.id}`}
            aria-current={isActive ? 'true' : undefined}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
              isActive
                ? 'bg-[#F43F5E] text-white shadow-lg shadow-rose-500/30 scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/10 active:scale-95'
            }`}
          >
            <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white animate-pulse' : 'text-slate-400'}`} />
            <span className="truncate">{shortName}</span>
          </button>
        );
      })}
    </nav>
  );
};

