'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LiveStreamPlayer from '@/components/LiveStreamPlayer';
import WinnerRoulette from '@/components/WinnerRoulette';
import RaffleBoard from '@/components/RaffleBoard';
import ReservationModal from '@/components/ReservationModal';
import { RaffleNumber } from '@/lib/types';
import { Tv, ShieldCheck, Lock, Share2, Copy, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

function SorteoContent() {
  const searchParams = useSearchParams();
  const raffleIdParam = searchParams.get('id');

  const { raffles, activeRaffle, setActiveRaffle, isAdminLoggedIn, setAdminLoggedIn } = useAppStore();
  const [selectedTicket, setSelectedTicket] = useState<RaffleNumber | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync active raffle from searchParam if provided
  useEffect(() => {
    if (raffleIdParam) {
      const found = raffles.find(r => r.id === raffleIdParam);
      if (found && found.id !== activeRaffle.id) {
        setActiveRaffle(found);
      }
    }
  }, [raffleIdParam, raffles, activeRaffle.id, setActiveRaffle]);

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `¡Unite al sorteo "${activeRaffle.title}"! Ganate ${activeRaffle.prize} por solo $${activeRaffle.price.toLocaleString('es-AR')}. ¡Reservá tu número ahora! ${url}`;

    if (navigator.share) {
      navigator.share({ title: activeRaffle.title, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('¡Enlace copiado al portapapeles!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-violet-500/30 bg-gradient-to-r from-violet-950/30 via-[#0D1117] to-cyan-950/30">
        {/* Left: Title & Live badge */}
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
              {activeRaffle.title}
            </h1>
          </div>
        </div>

        {/* Right: Actions row */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Organizer info */}
          <div className="font-mono text-xs text-slate-300 text-right">
            <span className="text-slate-400 block">ORGANIZADO POR</span>
            <span className="text-cyan-400 font-bold">{activeRaffle.admin_name || 'Admin Creador'}</span>
          </div>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold transition-all"
            title="Compartir sorteo"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Compartir'}</span>
          </button>

          {/* Admin / Espectador mode toggle (demo) */}
          <button
            onClick={() => setAdminLoggedIn(!isAdminLoggedIn)}
            className={`px-3.5 py-2 rounded-xl font-mono text-xs border flex items-center space-x-1.5 transition-all ${
              isAdminLoggedIn
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
            title="Conmutar vista Admin / Espectador (demo)"
          >
            {isAdminLoggedIn ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Espectador</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. Transmisión en Vivo (personalizada por admin creador) */}
      <LiveStreamPlayer isAdmin={isAdminLoggedIn} />

      {/* 2. Ruleta de Sorteo (solo el admin puede disparar) */}
      <WinnerRoulette isAdmin={isAdminLoggedIn} />

      {/* 3. Cartón de Números en Vivo */}
      <RaffleBoard onSelectReservation={(t) => setSelectedTicket(t)} />

      {/* Modal de Reserva */}
      {selectedTicket && (
        <ReservationModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}

export default function LiveSorteoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-cyan-400 font-mono">
        Cargando estudio de sorteo en vivo...
      </div>
    }>
      <SorteoContent />
    </Suspense>
  );
}
