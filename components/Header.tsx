'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Tv, LayoutDashboard, Share2, Menu, X, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

export default function Header() {
  const { activeRaffle } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `¡Unite a los sorteos de Temtech Sorteos Online! Ganá espectaculares premios en vivo. ${url}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Temtech Sorteos Online',
        text,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success('¡Enlace copiado al portapapeles!');
    }
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
              SORTEOS ONLINE SaaS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Inicio
          </Link>
          <a href="#sorteos-activos" className="hover:text-cyan-400 transition-colors">
            Sorteos Activos
          </a>
          <a href="#ventajas" className="hover:text-cyan-400 transition-colors">
            Ventajas SaaS
          </a>
          <a href="#planes" className="hover:text-cyan-400 transition-colors">
            Planes
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Live Stream Button */}
          <Link
            href={`/sorteo?id=${activeRaffle.id}`}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/40 text-violet-300 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md shadow-violet-500/10 hover:shadow-violet-500/25"
          >
            <Tv className="w-4 h-4 text-violet-400 animate-pulse" />
            <span className="hidden sm:inline">Ver En Vivo</span>
          </Link>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="hidden sm:flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-semibold transition-all duration-200"
            title="Compartir enlace"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Compartir</span>
          </button>

          {/* Admin Link */}
          <Link
            href="/admin"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs sm:text-sm font-mono transition-all duration-200 shadow-lg shadow-cyan-500/20"
          >
            <LayoutDashboard className="w-4 h-4 text-black" />
            <span>Panel Admin</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-cyan-500/20 p-4 space-y-3 bg-black/90">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-semibold text-sm py-2 hover:text-cyan-400"
          >
            Inicio
          </Link>
          <a 
            href="#sorteos-activos" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-semibold text-sm py-2 hover:text-cyan-400"
          >
            Sorteos Activos
          </a>
          <a 
            href="#ventajas" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-semibold text-sm py-2 hover:text-cyan-400"
          >
            Ventajas SaaS
          </a>
          <a 
            href="#planes" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-semibold text-sm py-2 hover:text-cyan-400"
          >
            Planes de Suscripción
          </a>
        </div>
      )}
    </header>
  );
}
