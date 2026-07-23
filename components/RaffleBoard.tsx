'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, RefreshCw, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { RaffleNumber, NumberStatus } from '@/lib/types';
import NumberCard from './NumberCard';

interface RaffleBoardProps {
  onSelectReservation: (ticket: RaffleNumber) => void;
}

export default function RaffleBoard({ onSelectReservation }: RaffleBoardProps) {
  const { 
    numbers, 
    raffle, 
    settings, 
    filterStatus, 
    setFilterStatus, 
    searchQuery, 
    setSearchQuery 
  } = useAppStore();

  const totalCount = numbers.length;
  const availableCount = numbers.filter(n => n.status === 'available').length;
  const reservedCount = numbers.filter(n => n.status === 'reserved').length;
  const paidCount = numbers.filter(n => n.status === 'paid').length;

  const filteredNumbers = numbers.filter(n => {
    // Filter by status
    if (filterStatus !== 'all' && n.status !== filterStatus) return false;
    
    // Search query matching number or user name
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      const numStr = String(n.number);
      const nameStr = `${n.user_name || ''} ${n.user_lastname || ''}`.toLowerCase();
      return numStr.includes(query) || nameStr.includes(query);
    }
    
    return true;
  });

  return (
    <section id="carton" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <span>ELIGE TU NÚMERO DE LA SUERTE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Cartón Interactivo de Números
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Hacé click en cualquier número <strong className="text-emerald-400">DISPONIBLE</strong> para dar vuelta la tarjeta 3D, ver los datos de transferencia y reservarlo inmediatamente.
        </p>
      </div>

      {/* Filter and Search Bar Panel */}
      <div className="glass-panel p-4 rounded-2xl mb-8 border border-cyan-500/25 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all flex items-center space-x-1.5 ${
              filterStatus === 'all'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30 font-bold'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>TODOS</span>
            <span className="bg-black/30 px-1.5 py-0.5 rounded text-[10px]">{totalCount}</span>
          </button>

          <button
            onClick={() => setFilterStatus('available')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all flex items-center space-x-1.5 ${
              filterStatus === 'available'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 font-bold'
                : 'bg-slate-900/60 text-emerald-400 hover:bg-emerald-950/40 border border-emerald-900/50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>DISPONIBLES</span>
            <span className="bg-emerald-950/60 text-emerald-300 px-1.5 py-0.5 rounded text-[10px]">{availableCount}</span>
          </button>

          <button
            onClick={() => setFilterStatus('reserved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all flex items-center space-x-1.5 ${
              filterStatus === 'reserved'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 font-bold'
                : 'bg-slate-900/60 text-amber-400 hover:bg-amber-950/40 border border-amber-900/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>RESERVADOS</span>
            <span className="bg-amber-950/60 text-amber-300 px-1.5 py-0.5 rounded text-[10px]">{reservedCount}</span>
          </button>

          <button
            onClick={() => setFilterStatus('paid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all flex items-center space-x-1.5 ${
              filterStatus === 'paid'
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 font-bold'
                : 'bg-slate-900/60 text-red-400 hover:bg-red-950/40 border border-red-900/50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>VENDIDOS</span>
            <span className="bg-red-950/60 text-red-300 px-1.5 py-0.5 rounded text-[10px]">{paidCount}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por # o nombre..."
            className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all"
          />
        </div>

      </div>

      {/* Cards Grid: 10 columns on Desktop, 5 columns on Mobile */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2.5 sm:gap-3.5">
        {filteredNumbers.map((ticket) => (
          <NumberCard
            key={ticket.id}
            ticket={ticket}
            price={raffle.price}
            onSelect={onSelectReservation}
          />
        ))}
      </div>

      {filteredNumbers.length === 0 && (
        <div className="glass-panel p-8 rounded-2xl text-center border border-dashed border-cyan-500/30 my-8">
          <p className="text-slate-400 text-sm font-mono">
            No se encontraron números con el filtro o búsqueda actual.
          </p>
        </div>
      )}

      {/* Status Legend */}
      <div className="mt-8 pt-6 border-t border-cyan-500/20 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-mono">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50" />
          <span>Disponible (Click para voltear)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-md shadow-amber-500/50" />
          <span>Reservado (Pendiente de pago)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-md shadow-red-500/50" />
          <span>Pagado / Vendido</span>
        </div>
      </div>
    </section>
  );
}
