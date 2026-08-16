'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAppStore } from '@/lib/store';
import { Settings as SettingsIcon, Save, CreditCard, MessageSquare, Share2, Tv, UserCheck, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { INITIAL_ADMINS } from '@/lib/supabaseClient';

export default function AdminSettingsPage() {
  const { settings, setSettings, activeAdmin, setActiveAdminProfile, activeRaffle, setActiveRaffle } = useAppStore();

  const [alias, setAlias] = useState(settings.alias);
  const [holder, setHolder] = useState(settings.holder);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [instagram, setInstagram] = useState(settings.instagram);
  const [facebook, setFacebook] = useState(settings.facebook);
  const [autoMessage, setAutoMessage] = useState(settings.auto_message);
  const [liveStreamUrl, setLiveStreamUrl] = useState(activeRaffle.live_stream_url || activeAdmin.live_stream_url || 'https://www.youtube.com/embed/5qap5aO4i9A');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    setSettings({
      ...settings,
      alias,
      holder,
      whatsapp,
      instagram,
      facebook,
      auto_message: autoMessage,
      live_stream_url: liveStreamUrl
    });

    // Also update active raffle stream URL
    setActiveRaffle({
      ...activeRaffle,
      live_stream_url: liveStreamUrl
    });

    toast.success('¡URL de transmisión en vivo y datos del administrador actualizados!');
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-4xl">
        <div>
          <span className="text-xs font-mono text-cyan-400 block uppercase">CONFIGURACIÓN GENERAL SaaS</span>
          <h1 className="text-3xl font-extrabold text-white">Ajustes del Administrador</h1>
        </div>

        {/* Multi-Admin Selector for Local Demo Testing */}
        <div className="glass-panel p-5 rounded-3xl border border-violet-500/30 bg-gradient-to-r from-violet-950/20 via-[#0D1117] to-cyan-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-violet-600/20 border border-violet-500/40 text-violet-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono text-violet-400 uppercase font-bold block">CUENTA ADMINISTRADORA ACTIVA</span>
              <h2 className="text-lg font-bold text-white">{activeAdmin.full_name}</h2>
              <span className="text-xs text-slate-400 font-mono">Plan: <strong className="text-cyan-400 uppercase">{activeAdmin.subscription_plan}</strong></span>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Cambiar Administrador (Demo):</label>
            <select
              value={activeAdmin.id}
              onChange={(e) => {
                const found = INITIAL_ADMINS.find(a => a.id === e.target.value);
                if (found) {
                  setActiveAdminProfile(found);
                  setLiveStreamUrl(found.live_stream_url || '');
                  toast.info(`Cambiaste a la cuenta de ${found.full_name}`);
                }
              }}
              className="bg-[#06070A] border border-violet-500/40 text-white font-mono text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-violet-400 w-full"
            >
              {INITIAL_ADMINS.map(adm => (
                <option key={adm.id} value={adm.id}>
                  {adm.full_name} ({adm.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-8">
          
          {/* Section 1: Live Stream URL per Admin */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Tv className="w-5 h-5 text-cyan-400" />
              <span>Link de Transmisión En Vivo (Único por Admin)</span>
            </h3>

            <div className="space-y-3">
              <label className="block text-xs font-mono text-cyan-300">URL o Embed de Transmisión (YouTube / Twitch / Kick)</label>
              <input
                type="text"
                value={liveStreamUrl}
                onChange={(e) => setLiveStreamUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... o https://player.twitch.tv/?channel=..."
                required
                className="w-full bg-[#06070A] border border-cyan-500/40 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 shadow-inner"
              />
              <p className="text-xs text-slate-400 font-mono">
                Cada administrador posee una URL de transmisión diferente. Este enlace se mostrará automáticamente a los participantes al ingresar a tus sorteos.
              </p>
            </div>
          </div>

          {/* Section 2: Transfer & Bank Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2 border-b border-slate-800 pb-2">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              <span>Datos Bancarios y Cobro</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono text-cyan-300 mb-2">Alias CBU / Mercado Pago</label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  required
                  className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-300 mb-2">Titular de la Cuenta</label>
                <input
                  type="text"
                  value={holder}
                  onChange={(e) => setHolder(e.target.value)}
                  required
                  className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Contact & Socials */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Share2 className="w-5 h-5 text-cyan-400" />
              <span>WhatsApp y Redes Sociales</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-mono text-cyan-300 mb-2">WhatsApp de Recepción</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                  className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-300 mb-2">Instagram (@usuario)</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-300 mb-2">Facebook</label>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Section 4: WhatsApp Message */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2 border-b border-slate-800 pb-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <span>Mensaje Automático de WhatsApp</span>
            </h3>

            <div>
              <textarea
                value={autoMessage}
                onChange={(e) => setAutoMessage(e.target.value)}
                rows={3}
                className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm font-mono shadow-lg shadow-cyan-500/30 flex items-center space-x-2 transition-all"
            >
              <Save className="w-5 h-5" />
              <span>Guardar Cambios del Admin</span>
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
