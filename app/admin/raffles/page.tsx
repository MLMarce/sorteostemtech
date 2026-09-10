'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Raffle, RaffleStatus, RaffleNumber, DrawHistory } from '@/lib/types';
import { Plus, CheckCircle, Tv, Edit3, Trash2, Trophy, Play, RefreshCcw, Lock, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getAdminRaffles, 
  createRaffle, 
  updateRaffle, 
  deleteRaffle, 
  checkCanCreateRaffle,
  getRaffleNumbers,
  recordDrawWinner,
  getDrawHistory
} from '@/lib/supabaseClient';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminRafflesPage() {
  const { 
    raffles, 
    setRaffles, 
    activeRaffle, 
    setActiveRaffle, 
    activeAdmin, 
    numbers, 
    setNumbers 
  } = useAppStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prize, setPrize] = useState('');
  const [image, setImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [totalNumbers, setTotalNumbers] = useState(100);
  const [price, setPrice] = useState(2000);
  const [drawDate, setDrawDate] = useState('');
  const [drawTime, setDrawTime] = useState('21:00');
  const [status, setStatus] = useState<RaffleStatus>('active');
  const [primaryColor, setPrimaryColor] = useState('#00E5FF');
  const [liveStreamUrl, setLiveStreamUrl] = useState('');

  // Live Roulette / Draw in Admin Panel
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentDisplayNum, setCurrentDisplayNum] = useState<number | null>(null);
  const [winner, setWinner] = useState<{ number: number; name: string } | null>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [drawHistoryList, setDrawHistoryList] = useState<DrawHistory[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeAdmin.id) {
        const list = await getAdminRaffles(activeAdmin.id);
        setRaffles(list);
        if (list.length > 0) {
          selectRaffle(list[0]);
        }
      }
    } catch (err) {
      console.error('Error loading admin raffles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeAdmin.id]);

  const selectRaffle = async (r: Raffle) => {
    setIsCreatingNew(false);
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
    setPrimaryColor(r.primary_color || '#00E5FF');
    setLiveStreamUrl(r.live_stream_url || '');

    // Load numbers and history for this raffle
    const [nums, history] = await Promise.all([
      getRaffleNumbers(r.id),
      getDrawHistory(r.id)
    ]);
    setNumbers(nums);
    setDrawHistoryList(history);
  };

  const handleStartNewForm = async () => {
    // Check monthly limit for 'gratis' plan (1 raffle/month)
    const check = await checkCanCreateRaffle(activeAdmin.id, activeAdmin.subscription_plan);
    if (!check.canCreate) {
      toast.error(check.message || 'Límite de sorteos alcanzado para tu plan.');
      return;
    }

    setIsCreatingNew(true);
    setTitle('Nuevo Sorteo En Vivo');
    setDescription('¡Participá por este premio increíble con transmisión en vivo!');
    setPrize('PlayStation 5 o Moto 110cc');
    setImage('https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80');
    setBannerImage('');
    setTotalNumbers(100);
    setPrice(3000);
    setDrawDate(new Date().toISOString().split('T')[0]);
    setDrawTime('21:00');
    setStatus('active');
    setPrimaryColor('#00E5FF');
    setLiveStreamUrl(activeAdmin.live_stream_url || '');
  };

  const handleSaveRaffle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAdmin.id) {
      toast.error('Debes iniciar sesión para crear o modificar un sorteo.');
      return;
    }

    setSaving(true);

    try {
      if (isCreatingNew) {
        // Create in Supabase
        const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
        const created = await createRaffle({
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
          status,
          primary_color: primaryColor,
          slug,
          live_stream_url: liveStreamUrl,
        });

        if (created) {
          toast.success(`¡Sorteo "${title}" creado exitosamente con sus ${totalNumbers} números!`);
          await loadData();
          selectRaffle(created);
        } else {
          toast.error('Error al crear el sorteo en Supabase.');
        }
      } else {
        // Update in Supabase
        const ok = await updateRaffle(activeRaffle.id, {
          title,
          description,
          prize,
          image,
          banner_image: bannerImage,
          price: Number(price),
          draw_date: drawDate,
          draw_time: drawTime,
          status,
          primary_color: primaryColor,
          live_stream_url: liveStreamUrl,
        });

        if (ok) {
          toast.success(`¡Sorteo "${title}" actualizado correctamente en Supabase!`);
          await loadData();
        } else {
          toast.error('Error al actualizar el sorteo en Supabase.');
        }
      }
    } catch (err: any) {
      console.error('Error saving raffle:', err);
      toast.error(err.message || 'Error inesperado al guardar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este sorteo? Se eliminarán todos sus números y reservas.')) {
      return;
    }

    const ok = await deleteRaffle(id);
    if (ok) {
      toast.success('Sorteo eliminado correctamente.');
      await loadData();
    } else {
      toast.error('Error al eliminar el sorteo.');
    }
  };

  // Trigger celebration explosion
  const triggerWinnerConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00E5FF', '#3B82F6', '#10B981', '#F59E0B', '#EF4444']
    });
  };

  // Run draw roulette for active raffle
  const handleRunDraw = async () => {
    if (!activeRaffle.id) return;

    // Eligible numbers: paid tickets (or reserved if none paid yet)
    const paidTickets = numbers.filter(n => n.status === 'paid');
    const eligible = paidTickets.length > 0 ? paidTickets : numbers.filter(n => n.status === 'reserved');

    if (eligible.length === 0) {
      toast.error('No hay números con pago confirmado o reservado para realizar el sorteo.');
      return;
    }

    setIsSpinning(true);
    setWinner(null);
    setShowWinnerModal(false);

    const selectedTicket = eligible[Math.floor(Math.random() * eligible.length)];
    const winnerName = `${selectedTicket.user_name || 'Participante'} ${selectedTicket.user_lastname || ''}`.trim();

    let elapsed = 0;
    const totalDuration = 5000;
    let currentDelay = 50;

    const spinStep = async () => {
      elapsed += currentDelay;
      const tempNum = eligible[Math.floor(Math.random() * eligible.length)].number;
      setCurrentDisplayNum(tempNum);

      if (elapsed > totalDuration - 2000) {
        currentDelay += 35;
      }

      if (elapsed >= totalDuration) {
        setIsSpinning(false);
        setCurrentDisplayNum(selectedTicket.number);
        setWinner({ number: selectedTicket.number, name: winnerName });
        setShowWinnerModal(true);
        triggerWinnerConfetti();

        // Save winner in Supabase (draw_history, raffles status=finished, raffle_numbers status=winner)
        const record = await recordDrawWinner(
          activeRaffle.id,
          selectedTicket.number,
          winnerName,
          activeRaffle.live_stream_url
        );

        if (record) {
          toast.success(`¡Sorteo concluido! Ganador registrado: #${selectedTicket.number} - ${winnerName}`);
          // Reload raffle state
          await selectRaffle({ ...activeRaffle, status: 'finished' });
        }
        return;
      }

      setTimeout(spinStep, currentDelay);
    };

    setTimeout(spinStep, currentDelay);
  };

  return (
    <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-5xl">
      
      {/* Top Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-cyan-400 block uppercase">PANEL DE CONTROL DE SORTEOS</span>
            <span className="px-2 py-0.5 rounded bg-violet-950 border border-violet-700 text-violet-300 font-mono text-[10px] uppercase font-bold">
              Plan: {activeAdmin.subscription_plan}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Gestionar Mis Sorteos</h1>
        </div>

        <button
          onClick={handleStartNewForm}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs font-mono transition-all flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Crear Sorteo Nuevo</span>
        </button>
      </div>

      {/* Existing Raffles List Switcher */}
      {raffles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {raffles.map((r) => (
            <div
              key={r.id}
              onClick={() => selectRaffle(r)}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                !isCreatingNew && r.id === activeRaffle.id
                  ? 'glass-panel-glow border-cyan-400/80 bg-cyan-950/40'
                  : 'glass-panel border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                    r.status === 'finished' ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'
                  }`}>
                    {r.status === 'finished' ? 'Finalizado' : 'Activo'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">${r.price?.toLocaleString('es-AR')}</span>
                </div>
                <h4 className="font-bold text-white text-sm line-clamp-1">{r.title}</h4>
                <p className="text-xs text-slate-400 font-mono mt-1">Premio: {r.prize}</p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-mono text-cyan-400">Sortea: {r.draw_date}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }}
                  className="text-slate-500 hover:text-red-400 transition-colors p-1"
                  title="Eliminar Sorteo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── LIVE DRAW EXECUTION SECTION FOR ADMIN ─── */}
      {!isCreatingNew && activeRaffle.id && (
        <div className="glass-panel-glow p-6 sm:p-8 rounded-3xl border-2 border-yellow-400/50 shadow-2xl shadow-yellow-500/20 text-center relative overflow-hidden bg-gradient-to-r from-yellow-950/30 via-slate-950 to-amber-950/20">
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/40 text-yellow-300 font-mono text-xs mb-3">
              <Trophy className="w-4 h-4 text-yellow-400 animate-bounce" />
              <span>ESTUDIO EN VIVO — RULETA DE SORTEO</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              {isSpinning 
                ? '¡MEZCLANDO NÚMEROS EN DIRECTO!' 
                : drawHistoryList.length > 0 
                  ? '¡SORTEO FINALIZADO!' 
                  : `REALIZAR SORTEO EN VIVO: ${activeRaffle.title}`}
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mb-6">
              Como Administrador, podés hacer girar la ruleta en directo. El ganador se seleccionará automáticamente entre los números vendidos y quedará registrado de forma oficial en la vista pública.
            </p>

            {/* Slot Machine Display Frame */}
            <div className="relative w-64 h-36 sm:w-72 sm:h-40 rounded-3xl glass-panel border-4 border-yellow-400/70 flex items-center justify-center shadow-2xl shadow-yellow-500/30 my-3 bg-slate-950 overflow-hidden">
              <div className="scanline-effect absolute inset-0 pointer-events-none" />

              <span className="font-mono font-extrabold text-6xl sm:text-7xl text-yellow-300 text-glow-yellow">
                {currentDisplayNum !== null 
                  ? String(currentDisplayNum).padStart(2, '0') 
                  : drawHistoryList.length > 0 
                    ? String(drawHistoryList[0].winner_number).padStart(2, '0') 
                    : '??'}
              </span>
            </div>

            {/* Winner info if already drawn */}
            {drawHistoryList.length > 0 && !isSpinning && (
              <div className="mt-3 p-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 text-xs font-mono text-yellow-300 max-w-md">
                <p>Ganador Registrado: <strong>{drawHistoryList[0].winner_name}</strong> (Número #{String(drawHistoryList[0].winner_number).padStart(2, '0')})</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Fecha: {new Date(drawHistoryList[0].draw_date).toLocaleString('es-AR')}</p>
              </div>
            )}

            {/* Start Draw Button */}
            <div className="mt-5">
              <button
                onClick={handleRunDraw}
                disabled={isSpinning}
                className={`px-8 py-4 rounded-2xl font-extrabold text-base sm:text-lg tracking-wider flex items-center space-x-3 transition-all duration-300 shadow-xl ${
                  isSpinning
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-400 via-amber-500 to-emerald-500 text-black shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95'
                }`}
              >
                {isSpinning ? (
                  <>
                    <RefreshCcw className="w-5 h-5 animate-spin text-black" />
                    <span>GIRANDO RULETA EN DIRECTO...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current text-black" />
                    <span>{drawHistoryList.length > 0 ? 'REPETIR / INICIAR NUEVO GIRO' : 'INICIAR SORTEO DE NÚMEROS AHORA'}</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Winner Modal in Admin */}
          <AnimatePresence>
            {showWinnerModal && winner && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
              >
                <div className="relative w-full max-w-lg glass-panel-glow rounded-3xl p-8 border-4 border-yellow-400/80 shadow-2xl shadow-yellow-500/50 text-center overflow-hidden">
                  <div className="relative z-10 flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center shadow-xl shadow-yellow-500/30 animate-bounce">
                      <Trophy className="w-10 h-10 text-yellow-300" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-mono font-bold uppercase tracking-widest text-yellow-400">
                        ¡NÚMERO GANADOR DEL SORTEO!
                      </span>
                      <h2 className="text-3xl font-extrabold text-white">
                        {activeRaffle.prize}
                      </h2>
                    </div>

                    <div className="py-3 px-8 rounded-2xl glass-panel border-2 border-yellow-400 bg-slate-950/80 my-2">
                      <span className="text-xs font-mono text-yellow-400 block uppercase">NÚMERO GANADOR</span>
                      <span className="text-5xl font-extrabold font-mono text-yellow-300 text-glow-yellow">
                        #{String(winner.number).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-slate-400 font-mono">GANADOR:</span>
                      <h3 className="text-2xl font-extrabold text-emerald-400 text-glow-green">
                        {winner.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => setShowWinnerModal(false)}
                      className="mt-4 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs border border-slate-700 transition-colors"
                    >
                      Cerrar y Ver Resultados
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

      {/* Edit or Create Raffle Form */}
      <form onSubmit={handleSaveRaffle} className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6">
        
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 border-b border-slate-800 pb-3">
          <Edit3 className="w-4 h-4 text-cyan-400" />
          <span>{isCreatingNew ? 'CREANDO NUEVO SORTEO' : `EDITANDO: ${activeRaffle.title}`}</span>
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
            <span>URL de Transmisión En Vivo (YouTube Live / Twitch / Kick)</span>
          </label>
          <input
            type="text"
            value={liveStreamUrl}
            onChange={(e) => setLiveStreamUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... o https://player.twitch.tv/?channel=..."
            className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
          />
          <p className="text-[11px] text-slate-400 font-mono">
            Este link se incrustará automáticamente en la vista pública de tu sorteo para que los participantes sigan tu transmisión en vivo.
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
              required
              className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-cyan-300 mb-2">Imagen Banner Opcional (URL)</label>
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
              disabled={!isCreatingNew}
              required
              className={`w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none ${
                !isCreatingNew ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
            {!isCreatingNew && (
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">No modificable tras crearse</span>
            )}
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
              onChange={(e) => setStatus(e.target.value as RaffleStatus)}
              className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none"
            >
              <option value="active">Activo</option>
              <option value="finished">Finalizado</option>
              <option value="draft">Borrador</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm font-mono shadow-lg shadow-cyan-500/30 flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{saving ? 'Guardando en Supabase...' : isCreatingNew ? 'Publicar Nuevo Sorteo' : 'Guardar Cambios'}</span>
          </button>
        </div>

      </form>

    </main>
  );
}
