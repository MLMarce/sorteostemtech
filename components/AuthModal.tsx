'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, X, Mail, User, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { SubscriptionPlan } from '@/lib/types';
import { toast } from 'sonner';
import { supabase, getProfile } from '@/lib/supabaseClient';

export default function AuthModal() {
  const router = useRouter();
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    setAuthModalMode, 
    authModalPlan, 
    setAdminLoggedIn, 
    setActiveAdminProfile 
  } = useAppStore();

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(authModalPlan || 'gratis');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authModalPlan) {
      setSelectedPlan(authModalPlan);
    }
  }, [authModalPlan]);

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Por favor completa tu email y contraseña.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        setLoading(false);
        return;
      }

      if (data.user) {
        const profile = await getProfile(data.user.id);
        if (profile) {
          setActiveAdminProfile(profile);
        } else {
          setActiveAdminProfile({
            id: data.user.id,
            email: data.user.email || '',
            full_name: data.user.user_metadata?.full_name || 'Administrador',
            role: 'admin',
            subscription_plan: 'gratis',
            live_stream_url: '',
          });
        }
        setAdminLoggedIn(true);
        toast.success('¡Bienvenido al panel de administración!');
        closeAuthModal();
        router.push('/admin');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      toast.error(err.message || 'Ocurrió un error inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || 'Administrador',
            subscription_plan: selectedPlan,
          },
        },
      });

      if (error) {
        toast.error(error.message || 'Error al crear la cuenta.');
        setLoading(false);
        return;
      }

      if (data.user) {
        const profile = await getProfile(data.user.id);
        setActiveAdminProfile(profile || {
          id: data.user.id,
          email: data.user.email || '',
          full_name: fullName || 'Administrador',
          role: 'admin',
          subscription_plan: selectedPlan as SubscriptionPlan,
          live_stream_url: '',
        });
        setAdminLoggedIn(true);
        toast.success(`¡Cuenta creada con éxito! Bienvenido al plan ${selectedPlan.toUpperCase()}.`);
        closeAuthModal();
        router.push('/admin');
      }
    } catch (err: any) {
      console.error('Register error:', err);
      toast.error(err.message || 'Ocurrió un error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    { id: 'gratis', label: 'Gratis', desc: '1 sorteo / mes', color: 'border-slate-600' },
    { id: 'pro', label: 'Pro — $19/mes', desc: '5 sorteos / mes', color: 'border-cyan-500' },
    { id: 'ilimitado', label: 'Ilimitado — $49/mes', desc: 'Sin límites', color: 'border-violet-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeAuthModal}
        className="absolute inset-0"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-md glass-panel-glow rounded-3xl p-6 sm:p-8 border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/30 z-10 overflow-hidden max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-cyan-500/30"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-violet-600/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
          {authModalMode === 'login'
            ? <Lock className="w-7 h-7 text-cyan-400 animate-pulse" />
            : <Sparkles className="w-7 h-7 text-violet-400 animate-pulse" />
          }
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex rounded-2xl bg-slate-900/80 border border-slate-800 p-1 mb-5">
          <button
            type="button"
            onClick={() => setAuthModalMode('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 ${
              authModalMode === 'login'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setAuthModalMode('register')}
            className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 ${
              authModalMode === 'register'
                ? 'bg-violet-500 text-white shadow-md shadow-violet-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-5">
          {authModalMode === 'login' ? (
            <>
              <h2 className="text-2xl font-extrabold text-white mb-1">Acceder al Dashboard</h2>
              <p className="text-xs text-slate-400 font-mono">Ingresá con tu cuenta administradora</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-extrabold text-white mb-1">Crear Cuenta Administradora</h2>
              <p className="text-xs text-slate-400 font-mono">Registrate y comenzá a crear sorteos hoy</p>
            </>
          )}
        </div>

        {/* ─── LOGIN FORM ─── */}
        {authModalMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full bg-[#06070A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#06070A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-sm font-mono tracking-wide shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center space-x-2 mt-2 disabled:opacity-60"
            >
              <span>{loading ? 'Autenticando...' : 'Ingresar al Dashboard'}</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>

            <p className="text-center text-xs text-slate-500 font-mono pt-1">
              ¿No tenés cuenta?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('register')}
                className="text-violet-400 hover:text-violet-300 underline underline-offset-2 font-semibold transition-colors"
              >
                Crear una gratis (1 sorteo/mes)
              </button>
            </p>
          </form>
        )}

        {/* ─── REGISTER FORM ─── */}
        {authModalMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Nombre completo o Canal</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre o canal"
                  required
                  className="w-full bg-[#06070A] border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full bg-[#06070A] border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white font-mono focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mín. 6 caracteres"
                  required
                  className="w-full bg-[#06070A] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Confirmar</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetir"
                  required
                  className="w-full bg-[#06070A] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
            </div>

            {/* Plan selector */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5">Elegir plan</label>
              <div className="grid grid-cols-3 gap-2">
                {plans.map((plan) => (
                  <button
                    type="button"
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      selectedPlan === plan.id
                        ? `${plan.color} bg-violet-950/60 border-2`
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block">{plan.label.split(' — ')[0]}</span>
                    <span className="text-[10px] font-mono text-slate-400 block">{plan.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-600 text-white font-extrabold text-sm font-mono tracking-wide shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:from-violet-400 hover:to-pink-500 transition-all flex items-center justify-center space-x-2 mt-2 disabled:opacity-60"
            >
              <UserPlus className="w-4 h-4 text-white" />
              <span>{loading ? 'Creando cuenta...' : 'Crear Cuenta y Comenzar'}</span>
            </button>

            <p className="text-center text-xs text-slate-500 font-mono pt-1">
              ¿Ya tenés cuenta?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 font-semibold transition-colors"
              >
                Iniciar sesión
              </button>
            </p>
          </form>
        )}

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-center space-x-2 text-[10px] text-slate-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Protegido por Supabase Auth & Row Level Security</span>
        </div>

      </motion.div>
    </div>
  );
}
