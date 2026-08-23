import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const SoundController: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true);
  
  const spaceAudioRef = useRef<HTMLAudioElement | null>(null);
  const partyAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentPhase = useRef<number>(0);
  const isMutedRef = useRef<boolean>(true);

  useEffect(() => {
    // Usamos archivos .mp3 fiables para garantizar compatibilidad total (Safari/iOS/Chrome)
    // Space drone atmos
    const space = new Audio('https://cdn.freesound.org/previews/530/530635_11200595-lq.mp3');
    // Party beat / ambient
    const party = new Audio('https://cdn.freesound.org/previews/111/111051_1828069-lq.mp3');
    
    space.loop = true;
    party.loop = true;
    space.volume = 0;
    party.volume = 0;

    spaceAudioRef.current = space;
    partyAudioRef.current = party;

    const updateVolumes = (phase: number, muted: boolean) => {
      if (!space || !party) return;
      
      if (muted) {
        space.volume = 0;
        party.volume = 0;
        return;
      }

      let targetSpace = 0;
      let targetParty = 0;

      // Crossfade matemático basado en la fase del evento actual
      if (phase < 0.2) {
        const p = phase / 0.2;
        targetSpace = 0.5 * (1 - p);
        targetParty = 0.4 * p;
      } else if (phase <= 0.8) {
        targetSpace = 0.0;
        targetParty = 0.4;
      } else {
        const p = (phase - 0.8) / 0.2;
        targetSpace = 0.5 * p;
        targetParty = 0.4 * (1 - p);
      }

      // Evitamos errores de rango en el volumen
      space.volume = Math.max(0, Math.min(1, targetSpace));
      party.volume = Math.max(0, Math.min(1, targetParty));
    };

    const handlePhase = (e: CustomEvent<{ phase: number }>) => {
      currentPhase.current = e.detail?.phase ?? 0;
      updateVolumes(currentPhase.current, isMutedRef.current);
    };

    window.addEventListener('scrollPhase', handlePhase);
    
    return () => {
      window.removeEventListener('scrollPhase', handlePhase);
      space.pause();
      party.pause();
    };
  }, []);

  const toggleMute = () => {
    triggerHaptic('light');
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    isMutedRef.current = nextMuted;
    
    const space = spaceAudioRef.current;
    const party = partyAudioRef.current;

    if (!nextMuted) {
      // Calculamos e inyectamos el volumen exacto ANTES de hacer play 
      // para que suene de inmediato sin esperar a que el usuario haga scroll.
      if (space && party) {
         const phase = currentPhase.current;
         const targetSpace = phase < 0.2 ? 0.5 * (1 - phase/0.2) : phase > 0.8 ? 0.5 * ((phase-0.8)/0.2) : 0;
         const targetParty = phase < 0.2 ? 0.4 * (phase/0.2) : phase > 0.8 ? 0.4 * (1 - (phase-0.8)/0.2) : 0.4;
         space.volume = Math.max(0, Math.min(1, targetSpace));
         party.volume = Math.max(0, Math.min(1, targetParty));
      }

      // Reproducir al hacer click (interacción segura de usuario)
      space?.play().catch(e => console.warn("Audio play error:", e));
      party?.play().catch(e => console.warn("Audio play error:", e));
    } else {
      // Pausamos para ahorrar recursos si está muteado
      space?.pause();
      party?.pause();
    }
  };

  return (
    <button 
      onClick={toggleMute}
      data-testid="sound-toggle-btn"
      className="fixed bottom-6 left-6 z-50 p-3 bg-[#0F172A]/80 backdrop-blur-md border border-white/15 rounded-full text-white shadow-xl hover:scale-110 hover:border-[#38BDF8] transition-all duration-300"
      aria-label={isMuted ? "Activar sonido" : "Silenciar sonido"}
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6 text-slate-400" />
      ) : (
        <Volume2 className="w-6 h-6 text-[#38BDF8]" />
      )}
    </button>
  );
};
