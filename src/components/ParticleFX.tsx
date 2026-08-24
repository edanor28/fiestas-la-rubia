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
        <div data-testid="foam-bubbles" className="w-full h-full relative pointer-events-none">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-sky-300/40 bg-gradient-to-tr from-sky-400/20 via-pink-400/15 to-transparent shadow-[0_0_12px_rgba(56,189,248,0.25)] animate-float-bubble will-change-transform transform-gpu"
              style={{
                width: `${18 + (i % 4) * 10}px`,
                height: `${18 + (i % 4) * 10}px`,
                left: `${(i * 11 + 5) % 90}%`,
                bottom: '-40px',
                animationDuration: `${4 + (i % 3) * 1.2}s`,
                animationDelay: `${(i * 0.4)}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Discomóvil: Destellos estroboscópicos suaves */}
      {isDisco && (
        <div data-testid="disco-sparkles" className="w-full h-full relative pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-sky-500/10 rounded-full blur-3xl" />
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-70 shadow-[0_0_8px_#F43F5E] animate-pulse transform-gpu"
              style={{
                top: `${20 + (i * 12) % 60}%`,
                left: `${15 + (i * 15) % 70}%`,
                animationDuration: `${1.5 + (i % 3) * 0.5}s`,
                animationDelay: `${i * 0.25}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Noche de Rock: Chispas de escenario */}
      {isRock && (
        <div data-testid="rock-embers" className="w-full h-full relative pointer-events-none">
          <div className="absolute bottom-10 left-1/3 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#F59E0B] animate-float-bubble will-change-transform transform-gpu"
              style={{
                left: `${25 + (i * 8) % 55}%`,
                bottom: '-20px',
                animationDuration: `${3 + (i % 3) * 0.8}s`,
                animationDelay: `${i * 0.35}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

