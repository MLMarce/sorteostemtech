'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Sparkles, ArrowRight, UserCheck, Tv, Trophy, AlertCircle, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Raffle } from '@/lib/types';
import { getActiveRaffles } from '@/lib/supabaseClient';

export default function ActiveRafflesGrid() {
  const { raffles, setRaffles, setActiveRaffle } = useAppStore();
  const [loading, setLoading] = useState(true);

  const loadRaffles = async () => {
    setLoading(true);
    try {
      const data = await getActiveRaffles();
      setRaffles(data);
    } catch (err) {
      console.error('Error loading active raffles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRaffles();
  }, []);

  return (
    <section id="sorteos-activos" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Sorteos Oficiales Verificados</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Sorteos <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">Activos en la Plataforma</span>
        </h2>
        <p className="text-slate-400 text-base max-w-2xl mx-auto">
          Participá en los sorteos transmitidos en directo por cada organizador. Elegí tu sorteo favorito, reservá tus números y seguí la transmisión en vivo.
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 text-cyan-400 font-mono text-sm">
          <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
          <span>Cargando sorteos activos desde Supabase...</span>
        </div>
      )}

      {/* Empty state: User requested explicit message when no raffles are active */}
      {!loading && raffles.length === 0 && (
        <div className="glass-panel p-12 rounded-3xl border border-cyan-500/30 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto text-cyan-400">
            <Trophy className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="text-2xl font-extrabold text-white">No hay sorteos activos en este momento</h3>
          <p className="text-sm text-slate-400 font-mono">
            Sé el primero en crear y publicar un sorteo en la plataforma. Creá tu cuenta gratis y empezá en 2 minutos.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/login?mode=register"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono transition-all shadow-lg shadow-cyan-500/20"
            >
              <span>Crear Sorteo Gratis</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </Link>
          </div>
        </div>
      )}

      {/* Grid of Raffle Cards */}
      {!loading && raffles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {raffles.map((raffle: Raffle, index: number) => {
            const isFinished = raffle.status === 'finished';

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
                      src={raffle.image || 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80'}
                      alt={raffle.prize}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      {isFinished ? (
                        <div className="bg-amber-500/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1.5 text-[10px] font-mono font-bold text-black uppercase tracking-wider shadow-lg">
                          <Trophy className="w-3 h-3 text-black" />
                          <span>FINALIZADO</span>
                        </div>
                      ) : (
                        <div className="bg-red-500/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center space-x-1.5 text-[10px] font-mono font-bold text-white uppercase tracking-wider shadow-lg">
                          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                          <Tv className="w-3 h-3 text-white" />
                          <span>EN VIVO</span>
                        </div>
                      )}
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md border border-cyan-400/40 px-3 py-1 rounded-xl font-mono text-cyan-400 text-sm font-extrabold shadow-md">
                      ${raffle.price?.toLocaleString('es-AR')}
                    </div>
                  </div>

                  {/* Organizer Info */}
                  <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-2">
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span>Organizador: <strong>{raffle.admin_name || 'Admin'}</strong></span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                    {raffle.title}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
                    {raffle.description}
                  </p>

                  {/* Draw Date & Time */}
                  <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 mb-6 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>Sortea: <strong>{raffle.draw_date}</strong> {raffle.draw_time ? `a las ${raffle.draw_time} hs` : ''}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/sorteo?id=${raffle.id}`}
                  onClick={() => setActiveRaffle(raffle)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm font-mono tracking-wide transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40"
                >
                  <span>{isFinished ? 'Ver Resultado del Sorteo' : 'Participar en este Sorteo'}</span>
                  <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
