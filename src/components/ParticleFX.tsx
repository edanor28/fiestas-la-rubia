import React from 'react';

interface ParticleFXProps {
  activeEventIndex: number;
}

export const ParticleFX: React.FC<ParticleFXProps> = ({ activeEventIndex }) => {
  // Event 4 (index 3) is "Gran Fiesta de la Espuma & Juegos Infantiles"
  const isFoamParty = activeEventIndex === 3;
  // Event 1 (index 0) is "Gran Discomóvil"
  const isDisco = activeEventIndex === 0;
  // Event 3 (index 2) is "Noche de Rock"
  const isRock = activeEventIndex === 2;

  if (!isFoamParty && !isDisco && !isRock) return null;

  return (
    <div 
      data-testid="particle-fx-container"
      className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
    >
      {/* Fiesta de la Espuma: Burbujas flotantes */}
      {isFoamParty && (
        <div data-testid="foam-bubbles" className="w-full h-full relative">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-sky-300/40 bg-gradient-to-tr from-sky-400/20 via-pink-400/15 to-transparent backdrop-blur-[1px] shadow-[0_0_15px_rgba(56,189,248,0.3)] animate-float-bubble"
              style={{
                width: `${16 + (i % 5) * 12}px`,
                height: `${16 + (i % 5) * 12}px`,
                left: `${(i * 7.5 + 4) % 94}%`,
                bottom: '-40px',
                animationDuration: `${4.5 + (i % 4) * 1.5}s`,
                animationDelay: `${(i * 0.45)}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Discomóvil: Destellos estroboscópicos suaves */}
      {isDisco && (
        <div data-testid="disco-sparkles" className="w-full h-full relative">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-sky-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '2.5s' }} />
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-ping opacity-75 shadow-[0_0_10px_#F43F5E]"
              style={{
                top: `${20 + (i * 11) % 65}%`,
                left: `${15 + (i * 13) % 75}%`,
                animationDuration: `${1.8 + (i % 3) * 0.6}s`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Noche de Rock: Chispas de escenario */}
      {isRock && (
        <div data-testid="rock-embers" className="w-full h-full relative">
          <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#F59E0B] animate-float-bubble"
              style={{
                left: `${30 + (i * 6) % 50}%`,
                bottom: '-20px',
                animationDuration: `${3.5 + (i % 3)}s`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

