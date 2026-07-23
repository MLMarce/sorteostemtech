'use client';

import React from 'react';
import { Hash, CheckCircle2, Clock, Zap, DollarSign } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function StatCards() {
  const { numbers, raffle } = useAppStore();

  const total = numbers.length || 100;
  const paid = numbers.filter(n => n.status === 'paid').length;
  const reserved = numbers.filter(n => n.status === 'reserved').length;
  const available = numbers.filter(n => n.status === 'available').length;
  const revenue = paid * raffle.price;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      
      {/* Total Numbers */}
      <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 flex items-center space-x-3">
        <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          <Hash className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-mono block uppercase">TOTAL NÚMEROS</span>
          <span className="text-xl font-bold font-mono text-white">{total}</span>
        </div>
      </div>

      {/* Vendidos */}
      <div className="glass-panel p-4 rounded-2xl border border-red-500/30 flex items-center space-x-3">
        <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30">
          <CheckCircle2 className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-mono block uppercase">VENDIDOS</span>
          <span className="text-xl font-bold font-mono text-red-400 text-glow-red">{paid}</span>
        </div>
      </div>

      {/* Reservados */}
      <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 flex items-center space-x-3">
        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <Clock className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-mono block uppercase">RESERVADOS</span>
          <span className="text-xl font-bold font-mono text-amber-400">{reserved}</span>
        </div>
      </div>

      {/* Disponibles */}
      <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 flex items-center space-x-3">
        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <Zap className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-mono block uppercase">DISPONIBLES</span>
          <span className="text-xl font-bold font-mono text-emerald-400 text-glow-green">{available}</span>
        </div>
      </div>

      {/* Dinero Recaudado */}
      <div className="glass-panel p-4 rounded-2xl border border-cyan-400/40 flex items-center space-x-3 bg-gradient-to-br from-cyan-950/20 to-transparent">
        <div className="p-3 rounded-xl bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
          <DollarSign className="w-5 h-5 text-cyan-300" />
        </div>
        <div>
          <span className="text-[10px] text-cyan-400 font-mono block uppercase">RECAUDADO</span>
          <span className="text-xl font-bold font-mono text-cyan-300 text-glow-cyan">
            ${revenue.toLocaleString('es-AR')}
          </span>
        </div>
      </div>

    </div>
  );
}
