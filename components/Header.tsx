'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, LayoutDashboard, LogIn, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { isAdminLoggedIn, setAdminLoggedIn, activeAdmin } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setAdminLoggedIn(false);
    toast.success('Sesión cerrada correctamente.');
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-cyan-500/20 backdrop-blur-xl bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Brand / Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <div className="w-full h-full bg-[#0D1117] rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">
              TEMTECH
            </span>
            <span className="text-xs tracking-widest text-cyan-500/80 block uppercase font-mono font-semibold">
              SORTEOS ONLINE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Inicio
          </Link>
          <a href="/#sorteos-activos" className="hover:text-cyan-400 transition-colors">
            Sorteos Activos
          </a>
          <a href="/#ventajas" className="hover:text-cyan-400 transition-colors">
            Ventajas
          </a>
          <a href="/#planes" className="hover:text-cyan-400 transition-colors">
            Planes
          </a>
        </nav>

        {/* Right-side CTA */}
        <div className="flex items-center space-x-3">

          {isAdminLoggedIn ? (
            /* ─── Logged-in state ─── */
            <div className="flex items-center space-x-3">
              {/* Admin pill badge */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="max-w-[120px] truncate">{activeAdmin.full_name.split(' ')[0]}</span>
              </div>

              {/* Dashboard Button */}
              <Link
                href="/admin"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs sm:text-sm font-mono transition-all duration-200 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
              >
                <LayoutDashboard className="w-4 h-4 text-black" />
                <span>Dashboard</span>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-red-950/60 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-400 text-xs font-mono transition-all duration-200"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          ) : (
            /* ─── Logged-out state ─── */
            <div className="flex items-center space-x-3">
              <Link
                href="/admin/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-mono font-semibold transition-all duration-200"
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
                <span>Iniciar Sesión</span>
              </Link>

              <Link
                href="/admin/login?mode=register"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs sm:text-sm font-mono transition-all duration-200 shadow-lg shadow-cyan-500/20"
              >
                <span>Crear Cuenta</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
            aria-label="Menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-cyan-500/20 px-4 pb-4 pt-2 space-y-2 bg-black/95">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-semibold text-sm py-2.5 px-3 rounded-xl hover:bg-slate-800/60 hover:text-cyan-400 transition-all"
          >
            Inicio
          </Link>
          <a
            href="/#sorteos-activos"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-semibold text-sm py-2.5 px-3 rounded-xl hover:bg-slate-800/60 hover:text-cyan-400 transition-all"
          >
            Sorteos Activos
          </a>
          <a
            href="/#ventajas"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-semibold text-sm py-2.5 px-3 rounded-xl hover:bg-slate-800/60 hover:text-cyan-400 transition-all"
          >
            Ventajas
          </a>
          <a
            href="/#planes"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-semibold text-sm py-2.5 px-3 rounded-xl hover:bg-slate-800/60 hover:text-cyan-400 transition-all"
          >
            Planes
          </a>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            {isAdminLoggedIn ? (
              <>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 w-full py-2.5 px-3 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono font-semibold text-sm"
                >
                  <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                  <span>Ir al Dashboard</span>
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center space-x-2 w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 font-mono text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-sm"
                >
                  <LogIn className="w-4 h-4 text-cyan-400" />
                  <span>Iniciar Sesión</span>
                </Link>
                <Link
                  href="/admin/login?mode=register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-2.5 px-3 rounded-xl bg-cyan-500 text-black font-extrabold font-mono text-sm"
                >
                  Crear Cuenta Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
