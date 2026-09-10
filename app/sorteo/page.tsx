'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LiveStreamPlayer from '@/components/LiveStreamPlayer';
import RaffleBoard from '@/components/RaffleBoard';
import ReservationModal from '@/components/ReservationModal';
import LiveCountdown from '@/components/LiveCountdown';
import { RaffleNumber, DrawHistory } from '@/lib/types';
import { Tv, Share2, Check, Trophy, Calendar, UserCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getRaffleById, getActiveRaffles, getRaffleNumbers, getSettingsByRaffleAdmin, getDrawHistory } from '@/lib/supabaseClient';
import { toast } from 'sonner';

function SorteoContent() {
  const searchParams = useSearchParams();
  const raffleIdParam = searchParams.get('id');

  const { 
    activeRaffle, 
    setActiveRaffle, 
    setNumbers, 
    setSettings, 
    drawHistory, 
    setDrawHistory 
  } = useAppStore();

  const [selectedTicket, setSelectedTicket] = useState<RaffleNumber | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setNotFound(false);

    try {
      let targetRaffle = null;

      if (raffleIdParam) {
        targetRaffle = await getRaffleById(raffleIdParam);
      } else {
        const activeList = await getActiveRaffles();
        if (activeList.length > 0) {
          targetRaffle = activeList[0];
        }
      }

      if (!targetRaffle) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setActiveRaffle(targetRaffle);

      // Load numbers, settings, and draw history in parallel
      const [numbersData, settingsData, historyData] = await Promise.all([
        getRaffleNumbers(targetRaffle.id),
        getSettingsByRaffleAdmin(targetRaffle.id),
        getDrawHistory(targetRaffle.id)
      ]);

      setNumbers(numbersData);
      if (settingsData) setSettings(settingsData);
      setDrawHistory(historyData);

    } catch (err) {
      console.error('Error loading raffle details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [raffleIdParam]);

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `¡Participá del sorteo "${activeRaffle.title}"! Ganate ${activeRaffle.prize} por solo $${activeRaffle.price?.toLocaleString('es-AR')}. ¡Elegí tu número ahora! ${url}`;

    if (navigator.share) {
      navigator.share({ title: activeRaffle.title, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('¡Enlace copiado al portapapeles!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center space-y-4 text-cyan-400 font-mono">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <span>Cargando sorteo en vivo desde Supabase...</span>
      </div>
    );
  }

  if (notFound || !activeRaffle.id) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">Sorteo no encontrado</h2>
        <p className="text-sm text-slate-400 font-mono max-w-md">
          El sorteo solicitado no existe o no se encuentra activo actualmente.
        </p>
      </div>
    );
  }

  const isFinished = activeRaffle.status === 'finished' || drawHistory.length > 0;
  const winnerRecord = drawHistory.length > 0 ? drawHistory[0] : null;

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
              {isFinished ? (
                <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>SORTEO FINALIZADO</span>
                </div>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                    TRANSMISIÓN EN VIVO
                  </span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {activeRaffle.title}
            </h1>
          </div>
        </div>

        {/* Right: Actions row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Organizer info */}
          <div className="font-mono text-xs text-slate-300 text-left md:text-right">
            <span className="text-slate-400 block text-[10px]">ORGANIZADO POR</span>
            <span className="text-cyan-400 font-bold">{activeRaffle.admin_name || 'Organizador'}</span>
          </div>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold transition-all"
            title="Compartir sorteo"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Compartir'}</span>
          </button>
        </div>
      </div>

      {/* OFFICIAL WINNER BANNER (Displayed when draw is completed) */}
      {winnerRecord && (
        <div className="w-full glass-panel-glow rounded-3xl p-6 sm:p-8 border-4 border-yellow-400/80 shadow-2xl shadow-yellow-500/40 text-center relative overflow-hidden bg-gradient-to-br from-yellow-950/40 via-black to-amber-950/30">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center space-y-4">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 font-mono text-xs uppercase tracking-widest font-bold">
              <Trophy className="w-4 h-4 text-yellow-300 animate-bounce" />
              <span>RESULTADO OFICIAL DEL SORTEO</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              ¡Tenemos Ganador del Sorteo!
            </h2>

            <div className="py-4 px-10 rounded-2xl glass-panel border-2 border-yellow-400/80 bg-black/90 shadow-2xl shadow-yellow-500/30">
              <span className="text-xs font-mono text-yellow-400 block uppercase">NÚMERO GANADOR</span>
              <span className="text-5xl sm:text-7xl font-extrabold font-mono text-yellow-300 text-glow-yellow">
                #{String(winnerRecord.winner_number).padStart(2, '0')}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-mono uppercase">Ganador/a Oficial:</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 text-glow-green">
                {winnerRecord.winner_name || 'Participante'}
              </h3>
              <p className="text-xs text-slate-400 font-mono pt-1">
                Premio: <strong className="text-white">{activeRaffle.prize}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Countdown to Draw (if not finished) */}
      {!isFinished && activeRaffle.draw_date && (
        <div className="flex justify-center">
          <LiveCountdown targetDate={activeRaffle.draw_date} targetTime={activeRaffle.draw_time} />
        </div>
      )}

      {/* 1. Transmisión en Vivo (Broadcast del canal del creador) */}
      <LiveStreamPlayer 
        initialUrl={activeRaffle.live_stream_url} 
        isAdmin={false} 
      />

      {/* 2. Cartón de Números en Vivo para que los usuarios elijan y reserven */}
      <RaffleBoard onSelectReservation={(t) => setSelectedTicket(t)} />

      {/* Modal de Reserva */}
      {selectedTicket && (
        <ReservationModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onReserved={loadData}
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
