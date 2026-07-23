'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Tv, LayoutDashboard, Share2, Smartphone } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

export default function Header() {
  const { settings, raffle } = useAppStore();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = `¡Unite al ${raffle.title}! Gana una ${raffle.prize} por solo $${raffle.price}. ¡Reservá tu número ahora! ${url}`;
    
    if (navigator.share) {
      navigator.share({
        title: raffle.title,
        text,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('¡Enlace copiado al portapapeles!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 backdrop-blur-xl bg-black/40">
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

        {/* Action Controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Live Studio Button */}
          <Link
            href="/sorteo"
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/40 text-violet-300 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md shadow-violet-500/10 hover:shadow-violet-500/25"
          >
            <Tv className="w-4 h-4 text-violet-400 animate-pulse" />
            <span className="hidden sm:inline">En Vivo</span>
          </Link>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-semibold transition-all duration-200"
            title="Compartir por WhatsApp"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Compartir</span>
          </button>

          {/* Admin Link */}
          <Link
            href="/admin"
            className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-medium transition-all duration-200"
          >
            <LayoutDashboard className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Panel Admin</span>
          </Link>
        </div>

      </div>
    </header>
  );
}
