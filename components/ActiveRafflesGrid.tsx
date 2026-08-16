'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Calendar, Sparkles, ArrowRight, UserCheck, Tv } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Raffle } from '@/lib/types';

export default function ActiveRafflesGrid() {
  const { raffles, setActiveRaffle } = useAppStore();

  return (
    <section id="sorteos-activos" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Sorteos Verificados en Vivo</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Sorteos <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">Activos en la Plataforma</span>
        </h2>
        <p className="text-slate-400 text-base max-w-2xl mx-auto">
          Participá en los sorteos transmitidos en directo por cada uno de nuestros organizadores. Cada sorteo se realiza en vivo con una transmisión transparente e individual.
        </p>
      </div>

      {/* Grid of Raffle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {raffles.map((raffle: Raffle, index: number) => {
          // Calculate mock numbers progress
          const total = raffle.total_numbers || 100;
          const paidPercentage = Math.min(85, 25 + index * 20);

          return (
            <motion.div
              key={raffle.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-panel p-5 rounded-3xl border border-cyan-500/20 hover:border-cyan-400/60 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/15 flex flex-col justify-between group"
            >
              <div>
                {/* Image Showcase */}
                <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-4 bg-slate-900">
                  <Image
                    src={raffle.image}
                    alt={raffle.prize}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  
                  {/* Live Stream Badge */}
                  <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1.5 text-[10px] font-mono font-bold text-white uppercase tracking-wider shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <Tv className="w-3 h-3 text-white" />
                    <span>EN VIVO</span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md border border-cyan-400/40 px-3 py-1 rounded-xl font-mono text-cyan-400 text-sm font-extrabold shadow-md">
                    ${raffle.price.toLocaleString('es-AR')}
                  </div>
                </div>

                {/* Organizer Info */}
                <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-2">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span>Creado por: <strong>{raffle.admin_name || 'Organizador Admin'}</strong></span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {raffle.title}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
                  {raffle.description}
                </p>

                {/* Draw Date & Time */}
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 mb-4 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Sortea: <strong>{raffle.draw_date}</strong> a las <strong>{raffle.draw_time} hs</strong></span>
                </div>

                {/* Tickets Progress Bar */}
                <div className="space-y-1.5 mb-6">
                  <div className="flex justify-between text-xs font-mono text-slate-300">
                    <span>Números vendidos</span>
                    <span className="text-cyan-400 font-bold">{paidPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${paidPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link
                href={`/sorteo?id=${raffle.id}`}
                onClick={() => setActiveRaffle(raffle)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm font-mono tracking-wide transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40"
              >
                <span>Participar en este Sorteo</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
