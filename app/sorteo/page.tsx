'use client';

import React, { useState } from 'react';
import LiveStreamPlayer from '@/components/LiveStreamPlayer';
import WinnerRoulette from '@/components/WinnerRoulette';
import RaffleBoard from '@/components/RaffleBoard';
import ReservationModal from '@/components/ReservationModal';
import { RaffleNumber } from '@/lib/types';
import { Radio, Tv } from 'lucide-react';

export default function LiveSorteoPage() {
  const [selectedTicket, setSelectedTicket] = useState<RaffleNumber | null>(null);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-violet-500/30 bg-gradient-to-r from-violet-950/30 via-[#0D1117] to-cyan-950/30">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-violet-600/20 text-violet-400 border border-violet-500/40">
            <Tv className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                TRANSMISIÓN EN VIVO
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Estudio de Sorteo TEMTECH Live
            </h1>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 font-mono block">EVENTO EN DIRECTO</span>
          <span className="text-sm font-bold text-cyan-400 font-mono">PlayStation 5 Slim 1TB</span>
        </div>
      </div>

      {/* 1. Video Grande Player */}
      <LiveStreamPlayer />

      {/* 2. Ganador / Ruleta Tragamonedas */}
      <WinnerRoulette />

      {/* 3. Cartón de Números en Vivo */}
      <RaffleBoard onSelectReservation={(t) => setSelectedTicket(t)} />

      {/* Modal */}
      {selectedTicket && (
        <ReservationModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}
