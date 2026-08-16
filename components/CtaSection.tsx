'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden glass-panel-glow border-2 border-cyan-400/40 p-8 sm:p-14 text-center bg-gradient-to-r from-[#0D182A] via-[#0A101C] to-[#120B24] shadow-2xl shadow-cyan-500/20"
      >
        {/* Decorative Glow Orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-24 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-400/30 text-cyan-300 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Comienza en Menos de 2 Minutos</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            ¿Listo para Lanzar tu Propio <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">Sorteo Online en Vivo</span>?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Unite a la plataforma SaaS líder en sorteos en directo. Registra tu cuenta administradora, configura tu transmisión única y empieza a vender números hoy mismo.
          </p>

          {/* Action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/admin/login?mode=register"
              className="w-full sm:w-auto px-9 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 text-black font-extrabold text-base font-mono tracking-wide shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-3 group"
            >
              <Trophy className="w-5 h-5 text-yellow-300 group-hover:rotate-12 transition-transform" />
              <span>Crear Mi Cuenta Administradora</span>
              <ArrowRight className="w-5 h-5 text-black group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="#sorteos-activos"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-base font-mono tracking-wide transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Ver Sorteos Activos</span>
            </Link>
          </div>

          <div className="pt-4 flex items-center justify-center space-x-6 text-xs text-slate-400 font-mono">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Setup Instantáneo</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>1 Sorteo Gratis Incluido</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
