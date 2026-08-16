'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';

export default function PricingPlans() {
  const plans = [
    {
      name: 'Gratis',
      price: '$0',
      period: '/ mes',
      description: 'Ideal para creadores y organizadores que están comenzando.',
      features: [
        '1 Sorteo activo por mes',
        'Hasta 100 números por sorteo',
        'URL de Transmisión en vivo propia',
        'Ruleta digital de ganadores',
        'Reserva directa por WhatsApp',
        'Soporte comunitario'
      ],
      ctaText: 'Empezar Gratis',
      ctaLink: '/admin/login',
      isPopular: false,
      badgeColor: 'border-slate-700 text-slate-300'
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/ mes',
      description: 'Para streamers y emprendedores que realizan sorteos de forma constante.',
      features: [
        '5 Sorteos activos por mes',
        'Hasta 1.000 números por sorteo',
        'URL de Transmisión personalizada',
        'Personalización de colores y logo',
        'Exportación de lista a PDF y Excel',
        'Estadísticas de ventas en tiempo real',
        'Soporte prioritario por WhatsApp'
      ],
      ctaText: 'Obtener Plan Pro',
      ctaLink: '/admin/login?plan=pro',
      isPopular: true,
      badgeColor: 'border-cyan-400 text-cyan-300 bg-cyan-950/60'
    },
    {
      name: 'Ilimitado',
      price: '$49',
      period: '/ mes',
      description: 'Para agencias, empresas y grandes creadores con altos volúmenes de sorteos.',
      features: [
        'Sorteos ilimitados por mes',
        'Números ilimitados por sorteo',
        'Streaming multi-plataforma',
        'Branding 100% marca blanca',
        'Asistente de verificación con IA',
        'Dominio propio personalizado (opcional)',
        'Soporte técnico VIP 24/7 asignado'
      ],
      ctaText: 'Suscribirse a Ilimitado',
      ctaLink: '/admin/login?plan=ilimitado',
      isPopular: false,
      badgeColor: 'border-violet-400 text-violet-300 bg-violet-950/60'
    }
  ];

  return (
    <section id="planes" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Background Glow */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-4 mb-16 relative z-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Planes de Suscripción Flexibles</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Elige el Plan Perfecto <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400">para tu Negocio</span>
        </h2>
        <p className="text-slate-400 text-base max-w-2xl mx-auto">
          Escalá tus sorteos según tus necesidades. Cambiá de plan en cualquier momento sin contratos de permanencia.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 items-stretch">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={`glass-panel p-8 rounded-3xl border flex flex-col justify-between relative ${
              plan.isPopular
                ? 'border-cyan-400/80 shadow-2xl shadow-cyan-500/20 bg-gradient-to-b from-[#0D1625]/90 to-[#0A0E17]/90 scale-[1.02]'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Popular Badge */}
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-extrabold font-mono uppercase tracking-widest px-4 py-1 rounded-full shadow-lg shadow-cyan-500/30">
                MÁS POPULAR
              </div>
            )}

            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-white">{plan.name}</h3>
                  <p className="text-slate-400 text-xs mt-1 min-h-[32px]">{plan.description}</p>
                </div>
              </div>

              {/* Price Display */}
              <div className="my-6 flex items-baseline space-x-1">
                <span className="text-5xl font-extrabold font-mono text-white">{plan.price}</span>
                <span className="text-slate-400 font-mono text-sm">{plan.period}</span>
              </div>

              <hr className="border-slate-800/80 my-6" />

              {/* Features list */}
              <ul className="space-y-3.5 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center space-x-3 text-sm text-slate-300">
                    <div className="p-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <Link
              href={plan.ctaLink}
              className={`w-full py-4 rounded-2xl font-extrabold text-sm font-mono tracking-wide transition-all duration-300 flex items-center justify-center space-x-2 ${
                plan.isPopular
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              <span>{plan.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
