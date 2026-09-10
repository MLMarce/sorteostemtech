'use client';

import React from 'react';
import { DollarSign, CheckCircle2, Clock, Ticket, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function StatCards() {
  const { numbers, activeRaffle } = useAppStore();

  const total = numbers.length || activeRaffle.total_numbers || 100;
  const paidList = numbers.filter(n => n.status === 'paid');
  const reservedList = numbers.filter(n => n.status === 'reserved');
  const availableList = numbers.filter(n => n.status === 'available');

  const paidCount = paidList.length;
  const reservedCount = reservedList.length;
  const availableCount = availableList.length;

  const ticketPrice = Number(activeRaffle.price) || 0;
  const realRevenue = paidCount * ticketPrice;
  const potentialRevenue = (paidCount + reservedCount) * ticketPrice;
  const percentSold = total > 0 ? Math.round((paidCount / total) * 100) : 0;

  const stats = [
    {
      title: 'Recaudación Real (Pagados)',
      value: `$${realRevenue.toLocaleString('es-AR')}`,
      subtext: `${paidCount} tickets confirmados`,
      icon: DollarSign,
      color: 'text-emerald-400',
      bgGlow: 'bg-emerald-500/10 border-emerald-500/30'
    },
    {
      title: 'Tickets Vendidos',
      value: `${paidCount} / ${total}`,
      subtext: `${percentSold}% del sorteo vendido`,
      icon: CheckCircle2,
      color: 'text-cyan-400',
      bgGlow: 'bg-cyan-500/10 border-cyan-500/30'
    },
    {
      title: 'Tickets Reservados',
      value: `${reservedCount}`,
      subtext: 'Pendientes de verificar comprobante',
      icon: Clock,
      color: 'text-amber-400',
      bgGlow: 'bg-amber-500/10 border-amber-500/30'
    },
    {
      title: 'Tickets Disponibles',
      value: `${availableCount}`,
      subtext: 'Listos para ser reservados',
      icon: Ticket,
      color: 'text-violet-400',
      bgGlow: 'bg-violet-500/10 border-violet-500/30'
    },
    {
      title: 'Recaudación Potencial',
      value: `$${potentialRevenue.toLocaleString('es-AR')}`,
      subtext: 'Pagados + Reservas pendientes',
      icon: TrendingUp,
      color: 'text-blue-400',
      bgGlow: 'bg-blue-500/10 border-blue-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`p-4 rounded-2xl glass-panel border ${stat.bgGlow} flex flex-col justify-between space-y-2`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400 uppercase leading-tight line-clamp-1">{stat.title}</span>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </div>

            <div>
              <span className={`text-2xl font-extrabold font-mono ${stat.color} block`}>
                {stat.value}
              </span>
              <span className="text-[10px] text-slate-400 font-mono block">
                {stat.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
