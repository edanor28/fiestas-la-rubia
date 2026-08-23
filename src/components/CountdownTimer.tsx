import React, { useEffect, useState } from 'react';
import { Clock, Flame } from 'lucide-react';

interface CountdownTimerProps {
  targetDate?: Date;
  className?: string;
  compact?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  className = '',
  compact = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isFinished: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: false });

  useEffect(() => {
    // Si no se especifica targetDate, calcular la próxima edición de fiestas (22 Agosto 23:00h)
    const getTarget = (): Date => {
      if (targetDate) return targetDate;
      const now = new Date();
      const year = now.getFullYear();
      let target = new Date(year, 7, 22, 23, 0, 0); // 22 de Agosto 23:00h
      if (now.getTime() >= target.getTime()) {
        // Si ya pasó la fecha de este año, contar hacia el próximo año
        target = new Date(year + 1, 7, 22, 23, 0, 0);
      }
      return target;
    };

    const calculatedTarget = getTarget();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = calculatedTarget.getTime() - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isFinished: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isFinished) {
    return (
      <div 
        data-testid="countdown-live-badge"
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider animate-pulse ${className}`}
      >
        <span className="w-2 h-2 rounded-full bg-rose-500" />
        <Flame className="w-4 h-4 text-rose-400" />
        <span>¡Fiestas en Directo Ahora!</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div 
        data-testid="countdown-timer-compact"
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F172A]/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-sky-300 ${className}`}
      >
        <Clock className="w-3.5 h-3.5 text-sky-400" />
        <span>Faltan {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
      </div>
    );
  }

  return (
    <div 
      data-testid="countdown-timer"
      className={`flex items-center justify-center gap-2 sm:gap-3 text-white ${className}`}
    >
      {/* Días */}
      <div className="flex flex-col items-center p-2 sm:p-2.5 rounded-xl bg-[#0F172A]/70 backdrop-blur-md border border-white/10 min-w-[54px] sm:min-w-[62px] shadow-lg">
        <span className="text-lg sm:text-2xl font-black text-sky-400 leading-none">
          {timeLeft.days.toString().padStart(2, '0')}
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
          Días
        </span>
      </div>

      <span className="text-sky-400/60 font-bold text-lg leading-none">:</span>

      {/* Horas */}
      <div className="flex flex-col items-center p-2 sm:p-2.5 rounded-xl bg-[#0F172A]/70 backdrop-blur-md border border-white/10 min-w-[54px] sm:min-w-[62px] shadow-lg">
        <span className="text-lg sm:text-2xl font-black text-slate-100 leading-none">
          {timeLeft.hours.toString().padStart(2, '0')}
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
          Horas
        </span>
      </div>

      <span className="text-sky-400/60 font-bold text-lg leading-none">:</span>

      {/* Minutos */}
      <div className="flex flex-col items-center p-2 sm:p-2.5 rounded-xl bg-[#0F172A]/70 backdrop-blur-md border border-white/10 min-w-[54px] sm:min-w-[62px] shadow-lg">
        <span className="text-lg sm:text-2xl font-black text-slate-100 leading-none">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
          Min
        </span>
      </div>

      <span className="text-sky-400/60 font-bold text-lg leading-none">:</span>

      {/* Segundos */}
      <div className="flex flex-col items-center p-2 sm:p-2.5 rounded-xl bg-[#0F172A]/70 backdrop-blur-md border border-white/10 min-w-[54px] sm:min-w-[62px] shadow-lg">
        <span className="text-lg sm:text-2xl font-black text-[#F43F5E] leading-none">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
          Seg
        </span>
      </div>
    </div>
  );
};

