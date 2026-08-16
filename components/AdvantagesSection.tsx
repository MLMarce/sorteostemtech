'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tv, ShieldCheck, MessageSquare, Zap, Lock, Sparkles } from 'lucide-react';

export default function AdvantagesSection() {
  const advantages = [
    {
      icon: <Tv className="w-8 h-8 text-cyan-400" />,
      title: 'Transmisión En Vivo por Creador',
      description: 'Cada administrador utiliza su propia URL de streaming en directo (YouTube, Twitch o Kick). Tus participantes ven el sorteo en tu propio canal.',
      badge: 'Diferenciador Exclusivo'
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
      title: 'Ruleta 100% Verificable en Tiempo Real',
      description: 'Animación de ruleta digital transparente que selecciona al ganador entre los números pagados en vivo delante de la audiencia.',
      badge: 'Transparencia Total'
    },
    {
      icon: <Lock className="w-8 h-8 text-violet-400" />,
      title: 'Panel Admin Exclusivo',
      description: 'Solo la cuenta del administrador organizador puede iniciar el sorteo de números y gestionar los comprobantes de pago recibidos.',
      badge: 'Control Seguro'
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-blue-400" />,
      title: 'Integración Directa con WhatsApp',
      description: 'Reserva instantánea con mensaje automatizado directo al WhatsApp del organizador adjuntando el comprobante de transferencia.',
      badge: 'Automatización'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: 'Cartón de Números Ultra Rápido',
      description: 'Grid interactivo de números con actualización de disponibilidad en tiempo real y buscador rápido de comprobantes por nombre.',
      badge: 'UX Premium'
    },
    {
      icon: <Sparkles className="w-8 h-8 text-pink-400" />,
      title: 'Personalización de Marca',
      description: 'Configura tus propios colores de marca, logo de tu canal o negocio y alias de cobro sin comisiones por entrada.',
      badge: 'Marca Propia'
    }
  ];

  return (
    <section id="ventajas" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-4 mb-16 relative z-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-violet-500/30 text-violet-300 text-xs font-mono uppercase tracking-wider">
          <Zap className="w-4 h-4 text-violet-400" />
          <span>¿Por qué elegir Temtech?</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Ventajas de Utilizar <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400">Temtech Sorteos Online</span>
        </h2>
        <p className="text-slate-400 text-base max-w-2xl mx-auto">
          Diseñado para influencers, streamers, marcas y organizadores que buscan la máxima transparencia, control de pagos y la mejor experiencia para sus participantes.
        </p>
      </div>

      {/* Grid of Advantages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {advantages.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-violet-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700/60">
                  {item.icon}
                </div>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                  {item.badge}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
