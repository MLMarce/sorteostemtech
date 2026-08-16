'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAppStore } from '@/lib/store';
import { Raffle, RaffleNumber } from '@/lib/types';
import { Plus, Ticket, CheckCircle, Image as ImageIcon, Calendar, Clock, DollarSign, Tv, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminRafflesPage() {
  const { raffles, setRaffles, activeRaffle, setActiveRaffle, activeAdmin, setNumbers } = useAppStore();

  const [title, setTitle] = useState(activeRaffle.title);
  const [description, setDescription] = useState(activeRaffle.description);
  const [prize, setPrize] = useState(activeRaffle.prize);
  const [image, setImage] = useState(activeRaffle.image);
  const [bannerImage, setBannerImage] = useState(activeRaffle.banner_image || '');
  const [totalNumbers, setTotalNumbers] = useState(activeRaffle.total_numbers);
  const [price, setPrice] = useState(activeRaffle.price);
  const [drawDate, setDrawDate] = useState(activeRaffle.draw_date);
  const [drawTime, setDrawTime] = useState(activeRaffle.draw_time);
  const [status, setStatus] = useState(activeRaffle.status);
  const [primaryColor, setPrimaryColor] = useState(activeRaffle.primary_color);
  const [liveStreamUrl, setLiveStreamUrl] = useState(activeRaffle.live_stream_url || activeAdmin.live_stream_url || '');

  const handleSaveRaffle = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedRaffle: Raffle = {
      id: activeRaffle.id || `raf-${Date.now()}`,
      admin_id: activeAdmin.id,
      admin_name: activeAdmin.full_name,
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
      live_stream_url: liveStreamUrl,
      created_at: new Date().toISOString(),
    };

    // Update list of raffles
    const exists = raffles.some(r => r.id === updatedRaffle.id);
    let updatedList: Raffle[];
    if (exists) {
      updatedList = raffles.map(r => r.id === updatedRaffle.id ? updatedRaffle : r);
    } else {
      updatedList = [...raffles, updatedRaffle];
    }

    setRaffles(updatedList);
    setActiveRaffle(updatedRaffle);

    toast.success(`¡Sorteo "${title}" guardado con éxito y URL de transmisión configurada!`);
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-5xl">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <span className="text-xs font-mono text-cyan-400 block uppercase">PANEL DE CONTROL DE SORTEOS</span>
            <h1 className="text-3xl font-extrabold text-white">Gestionar Mis Sorteos</h1>
          </div>

          <button
            onClick={() => {
              const newRaffle: Raffle = {
                id: `raf-${Date.now()}`,
                admin_id: activeAdmin.id,
                admin_name: activeAdmin.full_name,
                title: 'Nuevo Sorteo En Vivo',
                description: 'Descripción del nuevo sorteo...',
                prize: 'Premio Especial',
                image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80',
                price: 2000,
                total_numbers: 100,
                draw_date: '2026-09-10',
                draw_time: '21:00',
                status: 'active',
                primary_color: '#00E5FF',
                slug: `nuevo-sorteo-${Date.now()}`,
                live_stream_url: activeAdmin.live_stream_url || '',
                created_at: new Date().toISOString()
              };
              setActiveRaffle(newRaffle);
              setTitle(newRaffle.title);
              setPrize(newRaffle.prize);
              setLiveStreamUrl(newRaffle.live_stream_url || '');
              toast.info('Se creó un borrador de nuevo sorteo');
            }}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono transition-all flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Crear Sorteo Nuevo</span>
          </button>
        </div>

        {/* Existing Raffles Quick Switcher */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {raffles.map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setActiveRaffle(r);
                setTitle(r.title);
                setDescription(r.description);
                setPrize(r.prize);
                setImage(r.image);
                setBannerImage(r.banner_image || '');
                setTotalNumbers(r.total_numbers);
                setPrice(r.price);
                setDrawDate(r.draw_date);
                setDrawTime(r.draw_time);
                setStatus(r.status);
                setPrimaryColor(r.primary_color);
                setLiveStreamUrl(r.live_stream_url || '');
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                r.id === activeRaffle.id
                  ? 'glass-panel-glow border-cyan-400/80 bg-cyan-950/40'
                  : 'glass-panel border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-mono text-cyan-400 block uppercase mb-1">
                Admin: {r.admin_name || 'Admin'}
              </span>
              <h4 className="font-bold text-white text-sm line-clamp-1">{r.title}</h4>
              <p className="text-xs text-slate-400 font-mono mt-1">${r.price.toLocaleString('es-AR')} / ticket</p>
            </button>
          ))}
        </div>

        {/* Edit Active Raffle Form */}
        <form onSubmit={handleSaveRaffle} className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6">
          
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 border-b border-slate-800 pb-3">
            <Edit3 className="w-4 h-4 text-cyan-400" />
            <span>EDITANDO: <strong>{activeRaffle.title}</strong></span>
          </div>

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

          {/* Dedicated Live Stream URL for this raffle */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
            <label className="block text-xs font-mono text-cyan-300 flex items-center space-x-2">
              <Tv className="w-4 h-4 text-cyan-400" />
              <span>URL de Transmisión En Vivo Específica de este Sorteo</span>
            </label>
            <input
              type="text"
              value={liveStreamUrl}
              onChange={(e) => setLiveStreamUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... o https://player.twitch.tv/?channel=..."
              className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
            />
            <p className="text-[11px] text-slate-400 font-mono">
              Cada sorteo se transmite en el canal del organizador creador. Modifica aquí el link directo de YouTube, Twitch o Kick.
            </p>
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
              <span>Guardar Sorteo y Link de Transmisión</span>
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
