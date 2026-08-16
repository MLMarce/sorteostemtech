'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Play, RefreshCcw, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { RaffleNumber, DrawHistory } from '@/lib/types';
import { saveMockWinnerHistory } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface WinnerRouletteProps {
  isAdmin?: boolean;
}

export default function WinnerRoulette({ isAdmin = true }: WinnerRouletteProps) {
  const { numbers, activeRaffle, updateNumberStatus } = useAppStore();
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentDisplayNum, setCurrentDisplayNum] = useState<number | null>(null);
  const [winner, setWinner] = useState<RaffleNumber | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);

  // Eligible pool: All paid or reserved tickets
  const eligibleTickets = numbers.filter(n => n.status === 'paid' || n.status === 'reserved');
  const poolToUse = eligibleTickets.length > 0 ? eligibleTickets : numbers;

  const triggerWinnerExplosion = () => {
    const count = 250;
    const defaults = { origin: { y: 0.6 } };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#00E5FF', '#3B82F6', '#7C3AED']
    });
    fire(0.2, {
      spread: 60,
      colors: ['#10B981', '#F59E0B', '#EF4444']
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
  };

  const startDraw = () => {
    if (!isAdmin) {
      toast.error('Solo la cuenta administradora organizadora puede iniciar el sorteo.');
      return;
    }

    if (poolToUse.length === 0) {
      toast.error('No hay números registrados para sortear.');
      return;
    }

    setIsSpinning(true);
    setWinner(null);
    setShowWinnerModal(false);

    // Pick random winner from pool
    const selectedWinner = poolToUse[Math.floor(Math.random() * poolToUse.length)];

    let speed = 50;
    let elapsed = 0;
    const totalDuration = 6000;

    const spinInterval = setInterval(() => {
      elapsed += speed;
      const randomTempNum = poolToUse[Math.floor(Math.random() * poolToUse.length)].number;
      setCurrentDisplayNum(randomTempNum);

      if (elapsed > totalDuration - 2000) {
        speed += 30;
      }

      if (elapsed >= totalDuration) {
        clearInterval(spinInterval);
        setIsSpinning(false);
        setCurrentDisplayNum(selectedWinner.number);
        setWinner(selectedWinner);
        setShowWinnerModal(true);
        triggerWinnerExplosion();

        // Mark winner in store
        updateNumberStatus(selectedWinner.number, 'winner');

        // Save to draw history
        const record: DrawHistory = {
          id: `draw-${Date.now()}`,
          raffle_id: activeRaffle.id,
          winner_number: selectedWinner.number,
          winner_name: `${selectedWinner.user_name || 'Participante'} ${selectedWinner.user_lastname || ''}`.trim(),
          draw_date: new Date().toISOString(),
          video_url: activeRaffle.live_stream_url || '',
        };
        saveMockWinnerHistory(record);
      }
    }, speed);
  };

  const formattedDisplay = currentDisplayNum !== null 
    ? String(currentDisplayNum).padStart(2, '0') 
    : '??';

  const formattedWinnerNum = winner 
    ? String(winner.number).padStart(2, '0') 
    : '??';

  return (
    <div className="w-full glass-panel-glow rounded-3xl p-6 border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/30 text-center relative overflow-hidden my-6">
      
      {/* Glow ambient lights */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center">
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-mono text-xs mb-4">
          <Trophy className="w-4 h-4 text-yellow-400 animate-bounce" />
          <span>ESTUDIO EN VIVO — RULETA DE NÚMEROS</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          {isSpinning ? '¡MEZCLANDO NÚMEROS EN TIEMPO REAL!' : winner ? '¡SORTEO FINALIZADO!' : 'RULETA DEL SORTEO EN DIRECTO'}
        </h3>
        <p className="text-slate-300 text-xs sm:text-sm max-w-md mb-6">
          {isAdmin 
            ? 'Como Administrador del sorteo, puedes iniciar la ruleta de selección de ganadores en directo.'
            : 'Solo el administrador creador del sorteo puede ejecutar el sorteo de números en vivo.'}
        </p>

        {/* Slot Machine Display Frame */}
        <div className="relative w-64 h-36 sm:w-80 sm:h-44 rounded-3xl glass-panel border-4 border-cyan-400/60 flex items-center justify-center shadow-2xl shadow-cyan-500/40 my-4 bg-slate-950 overflow-hidden group">
          
          <div className="scanline-effect absolute inset-0 pointer-events-none" />

          {/* Number Display */}
          <motion.div
            key={currentDisplayNum}
            initial={isSpinning ? { y: -50, opacity: 0 } : { scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.08 }}
            className="flex items-center justify-center"
          >
            <span className="font-mono font-extrabold text-6xl sm:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 via-blue-400 to-violet-500 text-glow-cyan">
              {formattedDisplay}
            </span>
          </motion.div>

          <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-3xl pointer-events-none" />
        </div>

        {/* Action / Trigger Button */}
        <div className="mt-4">
          {isAdmin ? (
            <button
              onClick={startDraw}
              disabled={isSpinning}
              className={`px-8 py-4 rounded-2xl font-extrabold text-lg tracking-wider flex items-center space-x-3 transition-all duration-300 shadow-xl ${
                isSpinning
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-400 via-amber-500 to-emerald-500 text-black shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95'
              }`}
            >
              {isSpinning ? (
                <>
                  <RefreshCcw className="w-6 h-6 animate-spin text-cyan-400" />
                  <span>GIRANDO RULETA EN DIRECTO...</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-current text-black" />
                  <span>INICIAR SORTEO DE NÚMEROS (ADMIN)</span>
                </>
              )}
            </button>
          ) : (
            <div className="px-6 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-400 font-mono text-xs flex items-center space-x-2 shadow-inner">
              <Lock className="w-4 h-4 text-yellow-400" />
              <span>Sorteo controlado únicamente por el organizador en vivo</span>
            </div>
          )}
        </div>

      </div>

      {/* WINNER MODAL */}
      <AnimatePresence>
        {showWinnerModal && winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
          >
            <div className="relative w-full max-w-lg glass-panel-glow rounded-3xl p-8 border-4 border-yellow-400/80 shadow-2xl shadow-yellow-500/50 text-center overflow-hidden">
              
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 bg-yellow-400/30 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center space-y-4">
                
                <div className="w-20 h-20 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center shadow-xl shadow-yellow-500/30 animate-bounce">
                  <Trophy className="w-10 h-10 text-yellow-300" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-yellow-400">
                    ¡NÚMERO GANADOR DEL SORTEO!
                  </span>
                  <h2 className="text-3xl font-extrabold text-white">
                    {activeRaffle.prize}
                  </h2>
                </div>

                <div className="py-3 px-8 rounded-2xl glass-panel border-2 border-cyan-400 bg-slate-950/80 my-2">
                  <span className="text-xs font-mono text-cyan-400 block uppercase">NÚMERO GANADOR</span>
                  <span className="text-5xl font-extrabold font-mono text-cyan-300 text-glow-cyan">
                    #{formattedWinnerNum}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-mono">ORGANIZADOR: {activeRaffle.admin_name || 'Admin'}</span>
                  <h3 className="text-2xl font-extrabold text-emerald-400 text-glow-green">
                    {winner.user_name || 'Participante'} {winner.user_lastname || ''}
                  </h3>
                  {winner.phone && (
                    <p className="text-xs text-slate-400 font-mono">
                      Teléfono: {winner.phone}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => setShowWinnerModal(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs border border-slate-700 transition-colors"
                >
                  Cerrar Ventana
                </button>

              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
