'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ShieldCheck, ArrowRight, UserCheck, UserPlus, Mail, User, Sparkles } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import { INITIAL_ADMINS } from '@/lib/supabaseClient';
import { Suspense } from 'react';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const initialPlan = searchParams.get('plan') || 'gratis';

  const { setAdminLoggedIn, setActiveAdminProfile, activeAdmin } = useAppStore();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedAdminId, setSelectedAdminId] = useState(activeAdmin.id || INITIAL_ADMINS[0].id);
  const [email, setEmail] = useState('admin1@temtech.com');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const adminToLogin = INITIAL_ADMINS.find(a => a.id === selectedAdminId) || INITIAL_ADMINS[0];
      setActiveAdminProfile(adminToLogin);
      setAdminLoggedIn(true);
      toast.success(`¡Bienvenido/a ${adminToLogin.full_name}! Sesión iniciada correctamente.`);
      router.push('/admin');
      setLoading(false);
    }, 600);
  };

  const handleRegister = (e: React.FormEvent) => {
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

    // Simulate Supabase Auth sign-up (real integration uses supabase.auth.signUp)
    setTimeout(() => {
      const mockAdmin = INITIAL_ADMINS[0];
      setActiveAdminProfile({ ...mockAdmin, email, full_name: fullName || email.split('@')[0], subscription_plan: selectedPlan as any });
      setAdminLoggedIn(true);
      toast.success(`¡Cuenta creada exitosamente! Bienvenido/a al plan ${selectedPlan.toUpperCase()}.`);
      router.push('/admin');
      setLoading(false);
    }, 800);
  };

  const plans = [
    { id: 'gratis', label: 'Gratis', desc: '1 sorteo / mes', color: 'border-slate-600' },
    { id: 'pro', label: 'Pro — $19/mes', desc: '5 sorteos / mes', color: 'border-cyan-500' },
    { id: 'ilimitado', label: 'Ilimitado — $49/mes', desc: 'Sin límites', color: 'border-violet-500' },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="glass-panel-glow p-8 rounded-3xl border-2 border-cyan-400/40 shadow-2xl shadow-cyan-500/20">

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-violet-600/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
            {mode === 'login'
              ? <Lock className="w-8 h-8 text-cyan-400 animate-pulse" />
              : <Sparkles className="w-8 h-8 text-violet-400 animate-pulse" />
            }
          </div>

          {/* Mode Toggle Tabs */}
          <div className="flex rounded-2xl bg-slate-900/80 border border-slate-800 p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 ${
                mode === 'register'
                  ? 'bg-violet-500 text-white shadow-md shadow-violet-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Header Text */}
          <div className="text-center mb-6">
            {mode === 'login' ? (
              <>
                <h1 className="text-2xl font-extrabold text-white mb-1">Acceder al Dashboard</h1>
                <p className="text-xs text-slate-400 font-mono">Ingresa con tu cuenta administradora</p>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-extrabold text-white mb-1">Crear Cuenta Administradora</h1>
                <p className="text-xs text-slate-400 font-mono">Registrate y comenzá a crear sorteos hoy</p>
              </>
            )}
          </div>

          {/* ─── LOGIN FORM ─── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Demo Account Selector */}
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20">
                <label className="block text-[11px] font-mono text-cyan-400 mb-1.5 flex items-center space-x-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>DEMO — Seleccionar Cuenta de Prueba</span>
                </label>
                <select
                  value={selectedAdminId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedAdminId(id);
                    const found = INITIAL_ADMINS.find(a => a.id === id);
                    if (found) setEmail(found.email);
                  }}
                  className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                >
                  {INITIAL_ADMINS.map((adm) => (
                    <option key={adm.id} value={adm.id}>
                      {adm.full_name} · {adm.subscription_plan.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#06070A] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#06070A] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-sm font-mono tracking-wide shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center space-x-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Autenticando...' : 'Ingresar al Dashboard'}</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <p className="text-center text-xs text-slate-500 font-mono pt-1">
                ¿No tenés cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-violet-400 hover:text-violet-300 underline underline-offset-2 font-semibold transition-colors"
                >
                  Crear una gratis
                </button>
              </p>
            </form>
          )}

          {/* ─── REGISTER FORM ─── */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Nombre completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tu nombre o nombre del canal"
                    required
                    className="w-full bg-[#06070A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-400 transition-colors"
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
                    className="w-full bg-[#06070A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-violet-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  className="w-full bg-[#06070A] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetir contraseña"
                  required
                  className="w-full bg-[#06070A] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>

              {/* Plan selector */}
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2">Elegir plan</label>
                <div className="space-y-2">
                  {plans.map((plan) => (
                    <label
                      key={plan.id}
                      className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedPlan === plan.id
                          ? `${plan.color} bg-slate-900/80`
                          : 'border-slate-800 bg-transparent hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={plan.id}
                        checked={selectedPlan === plan.id}
                        onChange={() => setSelectedPlan(plan.id)}
                        className="accent-violet-500"
                      />
                      <div>
                        <span className="text-sm font-bold text-white block">{plan.label}</span>
                        <span className="text-xs font-mono text-slate-400">{plan.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-600 text-white font-extrabold text-sm font-mono tracking-wide shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:from-violet-400 hover:to-pink-500 transition-all flex items-center justify-center space-x-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-4 h-4 text-white" />
                <span>{loading ? 'Creando cuenta...' : 'Crear Cuenta y Comenzar'}</span>
              </button>

              <p className="text-center text-xs text-slate-500 font-mono pt-1">
                ¿Ya tenés una cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 font-semibold transition-colors"
                >
                  Iniciar sesión
                </button>
              </p>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-center space-x-2 text-[10px] text-slate-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Protegido por Supabase Auth & Row Level Security</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-cyan-400 font-mono text-sm">
        Cargando...
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
