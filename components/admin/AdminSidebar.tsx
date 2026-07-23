'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Ticket, Hash, Settings, Tv, ArrowLeft, LogOut } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { setAdminLoggedIn } = useAppStore();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Gestión de Sorteos', href: '/admin/raffles', icon: Ticket },
    { label: 'Gestión de Números', href: '/admin/numbers', icon: Hash },
    { label: 'Configuración', href: '/admin/settings', icon: Settings },
    { label: 'Estudio Sorteo Live', href: '/sorteo', icon: Tv },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-cyan-500/20 p-6 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-80px)]">
      <div className="space-y-6">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase block mb-1">
            PANEL DE CONTROL
          </span>
          <h2 className="text-xl font-extrabold text-white">TEMTECH Admin</h2>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-mono font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2 pt-6 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center space-x-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al sitio web</span>
        </Link>

        <button
          onClick={() => setAdminLoggedIn(false)}
          className="w-full flex items-center space-x-2 text-xs font-mono text-red-400 hover:text-red-300 transition-colors pt-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
