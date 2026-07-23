'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, DollarSign, Trophy, ArrowDown, ShieldCheck, Zap } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import LiveCountdown from './LiveCountdown';

export default function Hero() {
  const { raffle, numbers } = useAppStore();

  const availableCount = numbers.filter(n => n.status === 'available').length;
  const totalCount = numbers.length || 100;

  const scrollToBoard = () => {
    const el = document.getElementById('carton');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Glow Orbs background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-violet-600/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Info & Details */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 flex flex-col space-y-6 text-left"
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-mono tracking-wide w-max shadow-lg shadow-cyan-500/10">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold uppercase">Gran Sorteo Oficial TEMTECH</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Ganá una{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 text-glow-cyan">
              {raffle.prize || 'PlayStation 5'}
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            {raffle.description}
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
            {/* Valor */}
            <div className="glass-panel p-4 rounded-2xl border border-cyan-500/25 flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-medium uppercase">Valor</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 text-glow-cyan">
                  ${raffle.price.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            {/* Fecha */}
            <div className="glass-panel p-4 rounded-2xl border border-blue-500/25 flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-medium uppercase">Fecha</span>
                <span className="text-sm sm:text-base font-bold text-white">
                  20 Agosto 2026
                </span>
              </div>
            </div>

            {/* Disponibles */}
            <div className="col-span-2 sm:col-span-1 glass-panel p-4 rounded-2xl border border-emerald-500/25 flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Zap className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-medium uppercase">Disponibles</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400 text-glow-green">
                  {availableCount} de {totalCount}
                </span>
              </div>
            </div>
          </div>

          {/* Countdown Component */}
          <div className="pt-2">
            <span className="text-xs text-cyan-400/80 font-mono tracking-widest block uppercase mb-2">
              Tiempo restante para el gran sorteo:
            </span>
            <LiveCountdown targetDate={raffle.draw_date} targetTime={raffle.draw_time} />
          </div>

          {/* Action Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={scrollToBoard}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-extrabold text-lg tracking-wide shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-3 group"
            >
              <Trophy className="w-6 h-6 text-yellow-300 group-hover:rotate-12 transition-transform" />
              <span>Participar Ahora</span>
              <ArrowDown className="w-5 h-5 text-cyan-200 group-hover:translate-y-1 transition-transform" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Sorteo 100% verificado en vivo</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Holographic Prize Card Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 relative flex justify-center"
        >
          <div className="relative w-full max-w-md aspect-square rounded-3xl glass-panel-glow p-4 flex flex-col items-center justify-between border-2 border-cyan-400/40 shadow-2xl shadow-cyan-500/30 overflow-hidden group">
            
            {/* Holographic overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-600/20 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl group-hover:bg-cyan-400/35 transition-all duration-500" />

            {/* Prize Image */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-cyan-500/20 bg-slate-900/60 flex items-center justify-center mt-2">
              <Image
                src={raffle.image}
                alt={raffle.prize}
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-transparent" />
            </div>

            {/* Floating Banner */}
            <div className="w-full text-center py-3 px-4 glass-panel rounded-xl border border-cyan-500/30 mt-3 flex items-center justify-between">
              <div>
                <span className="text-xs text-cyan-400 block font-mono">PREMIO PRINCIPAL</span>
                <span className="text-lg font-extrabold text-white">{raffle.prize}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block font-mono">VALOR NÚMERO</span>
                <span className="text-lg font-extrabold font-mono text-emerald-400 text-glow-green">
                  ${raffle.price.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
