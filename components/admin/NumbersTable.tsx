'use client';

import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Edit3, MessageCircle, Send } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { RaffleNumber, NumberStatus } from '@/lib/types';
import { toast } from 'sonner';

export default function NumbersTable() {
  const { numbers, updateNumberStatus, settings } = useAppStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | NumberStatus>('all');
  const [editingTicket, setEditingTicket] = useState<RaffleNumber | null>(null);
  const [editName, setEditName] = useState('');
  const [editLastname, setEditLastname] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const filtered = numbers.filter(n => {
    if (filter !== 'all' && n.status !== filter) return false;
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      const numStr = String(n.number);
      const nameStr = `${n.user_name || ''} ${n.user_lastname || ''} ${n.phone || ''}`.toLowerCase();
      return numStr.includes(q) || nameStr.includes(q);
    }
    return true;
  });

  const handleConfirmPayment = (ticket: RaffleNumber) => {
    updateNumberStatus(ticket.number, 'paid');
    toast.success(`¡Pago verificado! El número #${String(ticket.number).padStart(2, '0')} ahora figura como VENDIDO.`);
  };

  const handleCancelReservation = (ticket: RaffleNumber) => {
    updateNumberStatus(ticket.number, 'available', { name: '', lastname: '', phone: '' });
    toast.info(`Reserva cancelada. El número #${String(ticket.number).padStart(2, '0')} volvió a estar DISPONIBLE.`);
  };

  const handleOpenEdit = (ticket: RaffleNumber) => {
    setEditingTicket(ticket);
    setEditName(ticket.user_name || '');
    setEditLastname(ticket.user_lastname || '');
    setEditPhone(ticket.phone || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTicket) return;
    updateNumberStatus(editingTicket.number, editingTicket.status, {
      name: editName,
      lastname: editLastname,
      phone: editPhone,
    });
    toast.success('Datos del participante actualizados correctamente.');
    setEditingTicket(null);
  };

  const handleSendWhatsapp = (ticket: RaffleNumber) => {
    if (!ticket.phone) {
      toast.error('Este número no tiene teléfono registrado.');
      return;
    }
    const cleanPhone = ticket.phone.replace(/\D/g, '');
    const text = `Hola ${ticket.user_name || ''}, te contactamos de TEMTECH Sorteos sobre tu número #${String(ticket.number).padStart(2, '0')}.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30">
      
      {/* Header controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-extrabold text-white">Gestión de Números</h3>
          <p className="text-xs text-slate-400 font-mono">Confirmá pagos y administrá las reservas en tiempo real.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-[#06070A] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="available">Disponibles</option>
            <option value="reserved">Reservados</option>
            <option value="paid">Pagados</option>
          </select>

          {/* Search Input */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar # o cliente..."
              className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900/80 text-cyan-400 border-b border-cyan-500/20 uppercase tracking-wider">
            <tr>
              <th className="p-3"># Núm</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">WhatsApp</th>
              <th className="p-3">Estado</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((ticket) => {
              const formattedNum = String(ticket.number).padStart(2, '0');
              return (
                <tr key={ticket.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 font-bold text-cyan-300">
                    #{formattedNum}
                  </td>
                  <td className="p-3 text-white">
                    {ticket.user_name || ticket.user_lastname ? (
                      `${ticket.user_name || ''} ${ticket.user_lastname || ''}`
                    ) : (
                      <span className="text-slate-600 font-normal">Sin asignar</span>
                    )}
                  </td>
                  <td className="p-3 text-slate-300">
                    {ticket.phone || '-'}
                  </td>
                  <td className="p-3">
                    {ticket.status === 'available' && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                        Disponible
                      </span>
                    )}
                    {ticket.status === 'reserved' && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold">
                        Reservado
                      </span>
                    )}
                    {ticket.status === 'paid' && (
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 font-bold">
                        Pagado
                      </span>
                    )}
                    {ticket.status === 'winner' && (
                      <span className="px-2 py-0.5 rounded bg-yellow-500/30 text-yellow-300 border border-yellow-400 font-extrabold animate-pulse">
                        ★ GANADOR ★
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      
                      {/* Confirm payment */}
                      {ticket.status !== 'paid' && (
                        <button
                          onClick={() => handleConfirmPayment(ticket)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center space-x-1"
                          title="Confirmar Pago"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Confirmar Pago</span>
                        </button>
                      )}

                      {/* Cancel reservation */}
                      {ticket.status !== 'available' && (
                        <button
                          onClick={() => handleCancelReservation(ticket)}
                          className="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-colors"
                          title="Cancelar Reserva"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Edit client */}
                      <button
                        onClick={() => handleOpenEdit(ticket)}
                        className="px-2 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 transition-colors"
                        title="Editar Cliente"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Send WhatsApp */}
                      {ticket.phone && (
                        <button
                          onClick={() => handleSendWhatsapp(ticket)}
                          className="px-2 py-1 rounded-lg bg-green-500/20 hover:bg-green-500/40 text-green-300 border border-green-500/40 transition-colors"
                          title="Enviar WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-green-400" />
                        </button>
                      )}

                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Client Modal */}
      {editingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel-glow p-6 rounded-3xl border border-cyan-400/50 w-full max-w-md">
            <h4 className="text-lg font-bold text-white mb-4">
              Editar Cliente - Número #{String(editingTicket.number).padStart(2, '0')}
            </h4>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Nombre</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Apellido</label>
                <input
                  type="text"
                  value={editLastname}
                  onChange={(e) => setEditLastname(e.target.value)}
                  className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">WhatsApp</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTicket(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-extrabold text-xs font-mono"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
