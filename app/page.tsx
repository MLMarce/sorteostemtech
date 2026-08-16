'use client';

import React from 'react';
import Hero from '@/components/Hero';
import ActiveRafflesGrid from '@/components/ActiveRafflesGrid';
import AdvantagesSection from '@/components/AdvantagesSection';
import PricingPlans from '@/components/PricingPlans';
import CtaSection from '@/components/CtaSection';

export default function Home() {
  return (
    <div className="space-y-12 pb-16">
      {/* SaaS Hero Section */}
      <Hero />

      {/* Grid de Sorteos Activos (Cards) */}
      <ActiveRafflesGrid />

      {/* Ventajas de Temtech Sorteos Online */}
      <AdvantagesSection />

      {/* Planes de Suscripción (Gratis, Pro, Ilimitado) */}
      <PricingPlans />

      {/* Nuevo CTA para incitar a crear cuenta y sorteos */}
      <CtaSection />
    </div>
  );
}
