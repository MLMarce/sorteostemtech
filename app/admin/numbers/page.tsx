'use client';

import React from 'react';
import NumbersTable from '@/components/admin/NumbersTable';

export default function AdminNumbersPage() {
  return (
    <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
      <div>
        <span className="text-xs font-mono text-cyan-400 block uppercase">ADMINISTRACIÓN DE NÚMEROS</span>
        <h1 className="text-3xl font-extrabold text-white">Gestión y Verificación de Pagos</h1>
      </div>

      <NumbersTable />
    </main>
  );
}
