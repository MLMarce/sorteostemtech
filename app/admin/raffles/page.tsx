'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAppStore } from '@/lib/store';
import { Raffle, RaffleNumber } from '@/lib/types';
import { Plus, Ticket, CheckCircle, Image as ImageIcon, Calendar, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminRafflesPage() {
  const { raffle, setRaffle, setNumbers } = useAppStore();

  const [title, setTitle] = useState(raffle.title);
  const [description, setDescription] = useState(raffle.description);
  const [prize, setPrize] = useState(raffle.prize);
  const [image, setImage] = useState(raffle.image);
  const [bannerImage, setBannerImage] = useState(raffle.banner_image || '');
  const [totalNumbers, setTotalNumbers] = useState(raffle.total_numbers);
  const [price, setPrice] = useState(raffle.price);
  const [drawDate, setDrawDate] = useState(raffle.draw_date);
  const [drawTime, setDrawTime] = useState(raffle.draw_time);
  const [status, setStatus] = useState(raffle.status);
  const [primaryColor, setPrimaryColor] = useState(raffle.primary_color);

  const handleSaveRaffle = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedRaffle: Raffle = {
      id: raffle.id || `raf-${Date.now()}`,
      title,
      description,
      prize,
      image,
      banner_image: bannerImage,
      price: Number(price),
      total_numbers: Number(totalNumbers),
      draw_date: drawDate,
      draw_time: drawTime,
      status: status as any,
      primary_color: primaryColor,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      created_at: new Date().toISOString(),
    };

    // Auto-generate 1 to N numbers
    const newNumbersList: RaffleNumber[] = [];
    for (let i = 1; i <= Number(totalNumbers); i++) {
      newNumbersList.push({
        id: `num-${i}`,
        raffle_id: updatedRaffle.id,
        number: i,
        status: 'available',
      });
    }

    setRaffle(updatedRaffle);
    setNumbers(newNumbersList);

    toast.success(`¡Sorteo "${title}" guardado y ${totalNumbers} números generados automáticamente!`);
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-5xl">
        <div>
          <span className="text-xs font-mono text-cyan-400 block uppercase">CONFIGURACIÓN DE SORTEO</span>
          <h1 className="text-3xl font-extrabold text-white">Crear y Modificar Sorteo</h1>
        </div>

        <form onSubmit={handleSaveRaffle} className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-cyan-300 mb-2">Título del Sorteo</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-300 mb-2">Premio Principal</label>
              <input
                type="text"
                value={prize}
                onChange={(e) => setPrize(e.target.value)}
                required
                className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-cyan-300 mb-2">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-cyan-300 mb-2">Imagen del Premio (URL)</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-300 mb-2">Imagen Banner (URL)</label>
              <input
                type="text"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-mono text-cyan-300 mb-2">Cantidad de Números</label>
              <input
                type="number"
                value={totalNumbers}
                onChange={(e) => setTotalNumbers(Number(e.target.value))}
                min={10}
                max={1000}
                required
                className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-300 mb-2">Valor por Número ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min={100}
                required
                className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-300 mb-2">Estado del Sorteo</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none"
              >
                <option value="draft">Borrador</option>
                <option value="active">Activo</option>
                <option value="finished">Finalizado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-mono text-cyan-300 mb-2">Fecha del Sorteo</label>
              <input
                type="date"
                value={drawDate}
                onChange={(e) => setDrawDate(e.target.value)}
                required
                className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-300 mb-2">Hora del Sorteo</label>
              <input
                type="time"
                value={drawTime}
                onChange={(e) => setDrawTime(e.target.value)}
                required
                className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-300 mb-2">Color Principal (Hex)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 bg-[#06070A] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm font-mono shadow-lg shadow-cyan-500/30 flex items-center space-x-2 transition-all"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Guardar Sorteo y Generar Números</span>
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
