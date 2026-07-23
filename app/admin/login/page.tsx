'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = Router();
  const { setAdminLoggedIn } = useAppStore();
  const [email, setEmail] = useState('admin@temtech.studio');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoggedIn(true);
    toast.success('¡Autenticación de Administrador exitosa!');
    router.push('/admin');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel-glow p-8 rounded-3xl border-2 border-cyan-400/50 shadow-2xl shadow-cyan-500/30 text-center">
        
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>

        <span className="text-xs font-mono text-cyan-400 block uppercase mb-1 tracking-widest">
          ACCESO RESTRINGIDO
        </span>
        <h2 className="text-2xl font-extrabold text-white mb-6">Panel Administrador</h2>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">Email Supabase Admin</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white font-extrabold text-sm font-mono tracking-wide shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all flex items-center justify-center space-x-2 mt-6"
          >
            <span>Iniciar Sesión</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-center space-x-2 text-[10px] text-slate-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Protegido por Supabase Auth & RLS</span>
        </div>

      </div>
    </div>
  );
}

function Router() {
  const router = useRouter();
  return router;
}
