'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { supabase, getProfile } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { 
    isAdminLoggedIn, 
    setAdminLoggedIn, 
    activeAdmin, 
    setActiveAdminProfile,
    openAuthModal 
  } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Initialize auth listener with Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAdminLoggedIn(true);
        getProfile(session.user.id).then((prof) => {
          if (prof) {
            setActiveAdminProfile(prof);
          } else {
            setActiveAdminProfile({
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || 'Administrador',
              role: 'admin',
              subscription_plan: 'gratis',
              live_stream_url: '',
            });
          }
        });
      } else {
        setAdminLoggedIn(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setAdminLoggedIn(true);
        const prof = await getProfile(session.user.id);
        if (prof) {
          setActiveAdminProfile(prof);
        } else {
          setActiveAdminProfile({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || 'Administrador',
            role: 'admin',
            subscription_plan: 'gratis',
            live_stream_url: '',
          });
        }
      } else {
        setAdminLoggedIn(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAdminLoggedIn, setActiveAdminProfile]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setAdminLoggedIn(false);
      toast.success('Sesión cerrada correctamente.');
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 backdrop-blur-xl bg-black/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Brand / Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" className="w-10 h-10 drop-shadow-[0_0_8px_rgba(0,229,255,0.5)] group-hover:drop-shadow-[0_0_14px_rgba(0,229,255,0.7)] transition-all duration-300">
            <defs>
              <radialGradient id="hbg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0D1117"/>
                <stop offset="100%" stopColor="#060A10"/>
              </radialGradient>
              <radialGradient id="hglow" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#00E5FF" stopOpacity="0"/>
              </radialGradient>
              <linearGradient id="hstar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF"/>
                <stop offset="50%" stopColor="#7C3AED"/>
                <stop offset="100%" stopColor="#00E5FF"/>
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="7" fill="url(#hbg)"/>
            <rect width="32" height="32" rx="7" fill="url(#hglow)"/>
            <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="6.5" stroke="#00E5FF" strokeWidth="1.5" strokeOpacity="0.7"/>
            <rect x="7" y="9" width="18" height="3.5" rx="1.5" fill="url(#hstar)"/>
            <rect x="13.25" y="12.5" width="5.5" height="11" rx="1.5" fill="url(#hstar)"/>
            <circle cx="5.5" cy="5.5" r="1" fill="#00E5FF" fillOpacity="0.5"/>
            <circle cx="26.5" cy="5.5" r="1" fill="#00E5FF" fillOpacity="0.5"/>
            <circle cx="5.5" cy="26.5" r="1" fill="#7C3AED" fillOpacity="0.5"/>
            <circle cx="26.5" cy="26.5" r="1" fill="#7C3AED" fillOpacity="0.5"/>
          </svg>
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
          <Link href="/#sorteos-activos" className="hover:text-cyan-400 transition-colors">
            Sorteos Activos
          </Link>
          <Link href="/#ventajas" className="hover:text-cyan-400 transition-colors">
            Ventajas
          </Link>
          <Link href="/#planes" className="hover:text-cyan-400 transition-colors">
            Planes
          </Link>
        </nav>

        {/* Right-side CTA */}
        <div className="flex items-center space-x-3">

          {isAdminLoggedIn ? (
            /* ─── Logged-in state ─── */
            <div className="flex items-center space-x-3">
              {/* Admin pill badge */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="max-w-[120px] truncate">{activeAdmin.full_name?.split(' ')[0] || 'Admin'}</span>
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
            <div className="hidden md:flex items-center space-x-3">
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs sm:text-sm font-mono font-semibold transition-all duration-200 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
                <span>Iniciar Sesión</span>
              </button>

              <button
                type="button"
                onClick={() => openAuthModal('register', 'gratis')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs sm:text-sm font-mono transition-all duration-200 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <span>Crear Cuenta</span>
              </button>
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
          <Link
            href="/#sorteos-activos"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-semibold text-sm py-2.5 px-3 rounded-xl hover:bg-slate-800/60 hover:text-cyan-400 transition-all"
          >
            Sorteos Activos
          </Link>
          <Link
            href="/#ventajas"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-semibold text-sm py-2.5 px-3 rounded-xl hover:bg-slate-800/60 hover:text-cyan-400 transition-all"
          >
            Ventajas
          </Link>
          <Link
            href="/#planes"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-200 font-semibold text-sm py-2.5 px-3 rounded-xl hover:bg-slate-800/60 hover:text-cyan-400 transition-all"
          >
            Planes
          </Link>

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
                <button
                  type="button"
                  onClick={() => { openAuthModal('login'); setMobileMenuOpen(false); }}
                  className="flex items-center space-x-2 w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-sm cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-cyan-400" />
                  <span>Iniciar Sesión</span>
                </button>
                <button
                  type="button"
                  onClick={() => { openAuthModal('register', 'gratis'); setMobileMenuOpen(false); }}
                  className="flex items-center justify-center w-full py-2.5 px-3 rounded-xl bg-cyan-500 text-black font-extrabold font-mono text-sm cursor-pointer"
                >
                  Crear Cuenta Gratis
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
