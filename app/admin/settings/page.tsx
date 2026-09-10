'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Save, CreditCard, MessageSquare, Share2, Tv, RefreshCw, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { getSettingsByUserId, saveSettings } from '@/lib/supabaseClient';

export default function AdminSettingsPage() {
  const { settings, setSettings, activeAdmin } = useAppStore();

  const [alias, setAlias] = useState('');
  const [holder, setHolder] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [autoMessage, setAutoMessage] = useState('');
  const [liveStreamUrl, setLiveStreamUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    if (!activeAdmin.id) return;
    setLoading(true);
    try {
      const data = await getSettingsByUserId(activeAdmin.id);
      if (data) {
        setSettings(data);
        setAlias(data.alias || '');
        setHolder(data.holder || '');
        setWhatsapp(data.whatsapp || '');
        setInstagram(data.instagram || '');
        setFacebook(data.facebook || '');
        setAutoMessage(data.auto_message || 'Hola. Reservé el número {number}. Adjunto comprobante.');
        setLiveStreamUrl(data.live_stream_url || '');
      } else {
        setHolder(activeAdmin.full_name || '');
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [activeAdmin.id]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAdmin.id) return;

    setSaving(true);
    const updatedSettings = {
      alias,
      holder,
      whatsapp,
      instagram,
      facebook,
      logo: settings.logo || 'TEMTECH Sorteos',
      primary_color: settings.primary_color || '#00E5FF',
      auto_message: autoMessage,
      live_stream_url: liveStreamUrl
    };

    const ok = await saveSettings(activeAdmin.id, updatedSettings);
    if (ok) {
      setSettings(updatedSettings);
      toast.success('¡Ajustes y datos bancarios guardados en Supabase con éxito!');
    } else {
      toast.error('Error al guardar los ajustes en Supabase.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <main className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center space-y-3 text-cyan-400 font-mono text-sm">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span>Cargando configuración desde Supabase...</span>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-4xl">
      <div>
        <span className="text-xs font-mono text-cyan-400 block uppercase">CONFIGURACIÓN GENERAL</span>
        <h1 className="text-3xl font-extrabold text-white">Ajustes del Organizador</h1>
      </div>

      {/* Admin Profile Info */}
      <div className="glass-panel p-5 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/20 via-[#0D1117] to-violet-950/20 flex items-center space-x-3">
        <div className="p-3 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400">
          <UserCheck className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase font-bold block">ORGANIZADOR REGISTRADO</span>
          <h2 className="text-lg font-bold text-white">{activeAdmin.full_name || 'Administrador'}</h2>
          <span className="text-xs text-slate-400 font-mono">
            Email: <strong className="text-white">{activeAdmin.email}</strong> · Plan: <strong className="text-cyan-400 uppercase">{activeAdmin.subscription_plan}</strong>
          </span>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-8">
        
        {/* Section 1: Default Live Stream URL */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2 border-b border-slate-800 pb-2">
            <Tv className="w-5 h-5 text-cyan-400" />
            <span>Link de Transmisión En Vivo Predeterminado</span>
          </h3>

          <div className="space-y-3">
            <label className="block text-xs font-mono text-cyan-300">URL de Transmisión (YouTube Live / Twitch / Kick)</label>
            <input
              type="text"
              value={liveStreamUrl}
              onChange={(e) => setLiveStreamUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... o https://player.twitch.tv/?channel=..."
              className="w-full bg-[#06070A] border border-cyan-500/40 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-cyan-400 shadow-inner"
            />
            <p className="text-xs text-slate-400 font-mono">
              Este enlace se usará por defecto para tus sorteos si no especificás una URL distinta para cada uno.
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
                placeholder="Ej. tu.alias.mp"
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
                placeholder="Nombre y Apellido del titular"
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
                placeholder="Ej. 5493510000000"
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
                placeholder="@tu.cuenta"
                className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-300 mb-2">Facebook</label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="usuarioFacebook"
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
            <p className="text-[11px] text-slate-400 font-mono mt-1">
              Podés usar las variables <code>&#123;number&#125;</code>, <code>&#123;name&#125;</code>, <code>&#123;lastname&#125;</code>, <code>&#123;phone&#125;</code>.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm font-mono shadow-lg shadow-cyan-500/30 flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Guardando en Supabase...' : 'Guardar Cambios'}</span>
          </button>
        </div>

      </form>
    </main>
  );
}
