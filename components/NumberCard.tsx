'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RaffleNumber } from '@/lib/types';
import { toast } from 'sonner';

interface NumberCardProps {
  ticket: RaffleNumber;
  price: number;
  onSelect: (ticket: RaffleNumber) => void;
  isSelected?: boolean;
}

export default function NumberCard({ ticket, price, onSelect, isSelected }: NumberCardProps) {
  const formattedNum = String(ticket.number).padStart(2, '0');

  const handleCardClick = () => {
    if (ticket.status === 'available') {
      onSelect(ticket);
    } else if (ticket.status === 'reserved') {
      toast.info(`El número ${formattedNum} está RESERVADO por ${ticket.user_name || 'un usuario'}.`);
    } else if (ticket.status === 'paid') {
      toast.error(`El número ${formattedNum} ya ha sido VENDIDO.`);
    }
  };

  // State Styles
  let borderClasses = 'border-emerald-500/50 hover:border-emerald-400 hover:shadow-emerald-500/40';
  let bgClasses = 'bg-emerald-950/15 hover:bg-emerald-900/30';
  let textClasses = 'text-emerald-400 text-glow-green';
  let statusBadge = null;

  if (ticket.status === 'reserved') {
    borderClasses = 'border-amber-500/60 shadow-amber-500/20';
    bgClasses = 'bg-amber-950/20';
    textClasses = 'text-amber-400';
    statusBadge = (
      <span className="absolute top-1 right-1 text-[8px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1 py-0.5 rounded border border-amber-500/40">
        RES
      </span>
    );
  } else if (ticket.status === 'paid') {
    borderClasses = 'border-red-500/60 shadow-red-500/20 opacity-80';
    bgClasses = 'bg-red-950/20';
    textClasses = 'text-red-400';
  }

  return (
    <motion.div
      layoutId={`number-card-${ticket.number}`}
      onClick={handleCardClick}
      whileHover={ticket.status === 'available' ? { y: -6, scale: 1.05 } : {}}
      whileTap={ticket.status === 'available' ? { scale: 0.96 } : {}}
      className={`w-full h-28 sm:h-32 rounded-2xl glass-panel border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between p-3 select-none ${borderClasses} ${bgClasses} ${isSelected ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Status Ribbon for Paid */}
      {ticket.status === 'paid' && (
        <div className="ribbon-sold">
          VENDIDO
        </div>
      )}

      {statusBadge}

      <span className="text-[10px] font-mono tracking-widest text-slate-400 self-start">
        #{formattedNum}
      </span>

      {/* Large Center Number */}
      <div className="my-auto flex flex-col items-center">
        <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${textClasses}`}>
          {formattedNum}
        </span>
      </div>

      {/* Footer info */}
      <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-1">
        <span>
          {ticket.status === 'available' ? 'DISPONIBLE' : ticket.status === 'reserved' ? 'RESERVADO' : 'PAGADO'}
        </span>
        <span className="text-emerald-400 font-bold">${price.toLocaleString('es-AR')}</span>
      </div>
    </motion.div>
  );
}
