'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAppStore } from '@/lib/store';
import { Settings as SettingsIcon, Save, CheckCircle, CreditCard, MessageSquare, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const { settings, setSettings } = useAppStore();

  const [alias, setAlias] = useState(settings.alias);
  const [holder, setHolder] = useState(settings.holder);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [instagram, setInstagram] = useState(settings.instagram);
  const [facebook, setFacebook] = useState(settings.facebook);
  const [logo, setLogo] = useState(settings.logo);
  const [primaryColor, setPrimaryColor] = useState(settings.primary_color);
  const [autoMessage, setAutoMessage] = useState(settings.auto_message);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    setSettings({
      alias,
      holder,
      whatsapp,
      instagram,
      facebook,
      logo,
      primary_color: primaryColor,
      auto_message: autoMessage,
    });

    toast.success('¡Configuración general y datos bancarios actualizados!');
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <AdminSidebar />

      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-4xl">
        <div>
          <span className="text-xs font-mono text-cyan-400 block uppercase">CONFIGURACIÓN GENERAL</span>
          <h1 className="text-3xl font-extrabold text-white">Ajustes del Sistema</h1>
        </div>

        <form onSubmit={handleSaveSettings} className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-8">
          
          {/* Section 1: Transfer & Bank Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2 border-b border-slate-800 pb-2">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              <span>Datos Bancarios y Transferencias</span>
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

          {/* Section 2: Contact & Socials */}
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

          {/* Section 3: Branding */}
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
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                Utilizá {'{number}'}, {'{name}'}, {'{lastname}'}, {'{phone}'} como etiquetas reemplazables.
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm font-mono shadow-lg shadow-cyan-500/30 flex items-center space-x-2 transition-all"
            >
              <Save className="w-5 h-5" />
              <span>Guardar Configuración</span>
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
