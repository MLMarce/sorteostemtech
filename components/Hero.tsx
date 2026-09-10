'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, ArrowRight, ShieldCheck, Tv, Zap, CheckCircle2, PlusCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function Hero() {
  const { activeRaffle, raffles } = useAppStore();
  const hasRaffles = raffles.length > 0 && Boolean(activeRaffle.id);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Glow Orbs background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[320px] bg-violet-600/15 rounded-full blur-[130px] pointer-events-none" />

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
            <Tv className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold uppercase">Plataforma SaaS de Sorteos en Vivo</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-white">
            La Plataforma de Sorteos{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 text-glow-cyan">
              Más Transparente y Conectada
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            <strong>TEMTECH Sorteos Online</strong> es la solución completa para creadores, marcas e influencers. Organizá tus sorteos, transmití en tu propio directo y gestioná comprobantes y números con total transparencia.
          </p>

          {/* Key Differentiators Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center space-x-2.5 p-3 rounded-2xl glass-panel border border-cyan-500/25">
              <Tv className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-200">Transmisión en Vivo por Sorteo</span>
            </div>
            <div className="flex items-center space-x-2.5 p-3 rounded-2xl glass-panel border border-emerald-500/25">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-200">Sorteo de Números 100% Auditado</span>
            </div>
            <div className="flex items-center space-x-2.5 p-3 rounded-2xl glass-panel border border-violet-500/25">
              <Zap className="w-5 h-5 text-violet-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-200">Gestión de Cobro Directo (Alias / CBU)</span>
            </div>
            <div className="flex items-center space-x-2.5 p-3 rounded-2xl glass-panel border border-blue-500/25">
              <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-200">Confirmaciones Automáticas vía WhatsApp</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => scrollToSection('sorteos-activos')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-extrabold text-lg tracking-wide shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-3 group"
            >
              <Trophy className="w-6 h-6 text-yellow-300 group-hover:rotate-12 transition-transform" />
              <span>Ver Sorteos Activos</span>
              <ArrowRight className="w-5 h-5 text-cyan-200 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              href="/admin/login?mode=register"
              className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-cyan-400 font-extrabold text-sm font-mono tracking-wide transition-all duration-300 flex items-center justify-center space-x-2 text-center"
            >
              <span>Crear Cuenta Gratis</span>
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Active Featured Raffle Card or CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 relative flex justify-center"
        >
          {hasRaffles ? (
            <div className="relative w-full max-w-md rounded-3xl glass-panel-glow p-5 flex flex-col justify-between border-2 border-cyan-400/40 shadow-2xl shadow-cyan-500/30 overflow-hidden group">
              
              {/* Holographic overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-600/20 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-3 z-10">
                <span className="text-xs text-cyan-400 font-mono font-bold uppercase tracking-wider bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/30">
                  SORTEO DESTACADO
                </span>
                <span className="text-xs font-mono text-slate-300">
                  {raffles.length} Activo{raffles.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* Prize Image */}
              <div className="relative w-full h-60 rounded-2xl overflow-hidden border border-cyan-500/20 bg-slate-900 flex items-center justify-center">
                <Image
                  src={activeRaffle.image || 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80'}
                  alt={activeRaffle.prize}
                  fill
                  priority
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-transparent" />
              </div>

              {/* Floating Banner */}
              <div className="w-full text-center py-3 px-4 glass-panel rounded-xl border border-cyan-500/30 mt-4 flex items-center justify-between z-10">
                <div className="text-left">
                  <span className="text-[10px] text-cyan-400 block font-mono uppercase">Organizador: {activeRaffle.admin_name || 'Admin'}</span>
                  <span className="text-base font-extrabold text-white line-clamp-1">{activeRaffle.prize}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block font-mono uppercase">Ticket</span>
                  <span className="text-base font-extrabold font-mono text-emerald-400 text-glow-green">
                    ${activeRaffle.price?.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              <Link
                href={`/sorteo?id=${activeRaffle.id}`}
                className="mt-3 w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider text-center transition-all shadow-md shadow-cyan-500/20"
              >
                Ver Transmisión y Entradas
              </Link>

            </div>
          ) : (
            <div className="relative w-full max-w-md rounded-3xl glass-panel-glow p-8 flex flex-col items-center justify-center text-center border-2 border-cyan-400/40 shadow-2xl shadow-cyan-500/20 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-cyan-400 animate-bounce" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Comenzá Tu Primer Sorteo</h3>
                <p className="text-xs text-slate-400 font-mono mt-2">
                  Registrate gratis y creá tu primer sorteo con link de transmisión en vivo y cartón interactivo.
                </p>
              </div>
              <Link
                href="/admin/login?mode=register"
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider text-center transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <PlusCircle className="w-4 h-4 text-black" />
                <span>Crear Sorteo Ahora</span>
              </Link>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}
