'use client';

import React, { useState } from 'react';
import Hero from '@/components/Hero';
import RaffleBoard from '@/components/RaffleBoard';
import ReservationModal from '@/components/ReservationModal';
import { RaffleNumber } from '@/lib/types';

export default function Home() {
  const [selectedTicket, setSelectedTicket] = useState<RaffleNumber | null>(null);

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <Hero />

      {/* Cartón Interactivo de Números */}
      <RaffleBoard onSelectReservation={(ticket) => setSelectedTicket(ticket)} />

      {/* Reservation Form Modal */}
      {selectedTicket && (
        <ReservationModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}
