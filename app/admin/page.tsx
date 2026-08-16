'use client';

import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import StatCards from '@/components/admin/StatCards';
import NumbersTable from '@/components/admin/NumbersTable';
import { useAppStore } from '@/lib/store';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Ticket, Plus, Tv, Settings, UserCheck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { activeRaffle, numbers, activeAdmin } = useAppStore();

  // Analytical data for velocity chart
  const salesChartData = [
    { day: 'Lun', reservados: 4, vendidos: 2 },
    { day: 'Mar', reservados: 6, vendidos: 5 },
    { day: 'Mié', reservados: 8, vendidos: 7 },
    { day: 'Jue', reservados: 12, vendidos: 10 },
    { day: 'Vie', reservados: 15, vendidos: 14 },
    { day: 'Sáb', reservados: 18, vendidos: 16 },
    { day: 'Dom', reservados: 22, vendidos: 22 },
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-cyan-400 block uppercase">PANEL PRINCIPAL SAAS</span>
              <span className="px-2 py-0.5 rounded bg-violet-950 border border-violet-700 text-violet-300 font-mono text-[10px] uppercase font-bold">
                Plan: {activeAdmin.subscription_plan}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Dashboard del Administrador</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Sesión iniciada como: <strong className="text-white">{activeAdmin.full_name}</strong> ({activeAdmin.email})
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/raffles"
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono transition-all flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Crear Sorteo</span>
            </Link>

            <Link
              href={`/sorteo?id=${activeRaffle.id}`}
              className="px-4 py-2.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-violet-300 font-extrabold text-xs font-mono transition-all flex items-center space-x-2"
            >
              <Tv className="w-4 h-4 text-violet-400" />
              <span>Ver Mi Transmisión</span>
            </Link>
          </div>
        </div>

        {/* 5 KPI Stat Cards */}
        <StatCards />

        {/* Sales Analytics Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-cyan-500/30">
            <h3 className="text-lg font-bold text-white mb-2">Velocidad de Ventas y Reservas</h3>
            <p className="text-xs text-slate-400 font-mono mb-6">Tendencia de actividad de los últimos 7 días.</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesChartData}>
                  <defs>
                    <linearGradient id="colorVendidos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReservados" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#6B7280" fontSize={12} tickLine={false} />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0D1117', 
                      borderColor: 'rgba(0,229,255,0.4)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }} 
                  />
                  <Area type="monotone" dataKey="vendidos" stroke="#10B981" fillOpacity={1} fill="url(#colorVendidos)" name="Pagados" />
                  <Area type="monotone" dataKey="reservados" stroke="#F59E0B" fillOpacity={1} fill="url(#colorReservados)" name="Reservados" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Raffle Status */}
          <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col justify-between">
            <div>
              <span className="text-xs text-cyan-400 font-mono block uppercase mb-1">SORTEO ACTIVO SELECCIONADO</span>
              <h3 className="text-xl font-extrabold text-white">{activeRaffle.title}</h3>
              <p className="text-xs text-slate-400 mt-2 font-mono">Premio: <strong className="text-white">{activeRaffle.prize}</strong></p>
              <p className="text-xs text-slate-400 font-mono">Precio por número: <strong className="text-emerald-400">${activeRaffle.price}</strong></p>
              <p className="text-xs text-slate-400 font-mono">Fecha: <strong className="text-white">{activeRaffle.draw_date} {activeRaffle.draw_time}</strong></p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Progreso de números</span>
                <span className="text-cyan-400 font-bold">
                  {numbers.filter(n => n.status === 'paid').length} / {numbers.length}
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(numbers.filter(n => n.status === 'paid').length / numbers.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Numbers Table */}
        <NumbersTable />

      </main>
    </div>
  );
}
