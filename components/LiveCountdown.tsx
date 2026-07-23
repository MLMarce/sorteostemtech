'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface LiveCountdownProps {
  targetDate: string; // e.g. "2026-08-20"
  targetTime: string; // e.g. "21:00"
}

export default function LiveCountdown({ targetDate, targetTime }: LiveCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isFinished: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetStr = `${targetDate}T${targetTime || '21:00'}:00`;
      const target = new Date(targetStr).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isFinished: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  if (timeLeft.isFinished) {
    return (
      <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-bold text-sm">
        <Clock className="w-4 h-4 animate-ping text-red-400" />
        <span>¡EL SORTEO ESTÁ EN CURSO O FINALIZADO!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-3 sm:space-x-4">
      <div className="flex flex-col items-center glass-panel px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-cyan-500/30">
        <span className="font-mono font-extrabold text-lg sm:text-2xl text-cyan-400 text-glow-cyan">
          {String(timeLeft.days).padStart(2, '0')}
        </span>
        <span className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider">
          Días
        </span>
      </div>
      <span className="text-cyan-500 font-bold text-xl sm:text-2xl animate-pulse">:</span>
      <div className="flex flex-col items-center glass-panel px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-cyan-500/30">
        <span className="font-mono font-extrabold text-lg sm:text-2xl text-cyan-400 text-glow-cyan">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider">
          Horas
        </span>
      </div>
      <span className="text-cyan-500 font-bold text-xl sm:text-2xl animate-pulse">:</span>
      <div className="flex flex-col items-center glass-panel px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-cyan-500/30">
        <span className="font-mono font-extrabold text-lg sm:text-2xl text-cyan-400 text-glow-cyan">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider">
          Min
        </span>
      </div>
      <span className="text-cyan-500 font-bold text-xl sm:text-2xl animate-pulse">:</span>
      <div className="flex flex-col items-center glass-panel px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-cyan-500/30">
        <span className="font-mono font-extrabold text-lg sm:text-2xl text-cyan-400 text-glow-cyan">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="text-[10px] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider">
          Seg
        </span>
      </div>
    </div>
  );
}
