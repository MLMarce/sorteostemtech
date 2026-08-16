'use client';

import React, { useState } from 'react';
import { Tv, Settings, Radio, Check, Edit3 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

interface LiveStreamPlayerProps {
  initialUrl?: string;
  isAdmin?: boolean;
}

export default function LiveStreamPlayer({ initialUrl, isAdmin = true }: LiveStreamPlayerProps) {
  const { activeRaffle, setActiveRaffle } = useAppStore();
  const currentStreamUrl = initialUrl || activeRaffle.live_stream_url || 'https://www.youtube.com/embed/5qap5aO4i9A';

  const [streamUrl, setStreamUrl] = useState(currentStreamUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [inputUrl, setInputUrl] = useState(currentStreamUrl);

  const handleUpdateUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl) return;
    setStreamUrl(inputUrl);
    
    // Update active raffle stream URL in store
    const updatedRaffle = { ...activeRaffle, live_stream_url: inputUrl };
    setActiveRaffle(updatedRaffle);
    
    setIsEditing(false);
    toast.success('¡URL de transmisión en vivo actualizada exitosamente!');
  };

  // Helper to format YouTube or Twitch or Kick URLs into embed format
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // YouTube Watch URL
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    // YouTube Short URL
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    // Twitch Channel URL
    if (url.includes('twitch.tv/')) {
      const channel = url.split('twitch.tv/')[1]?.split('?')[0];
      const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
      return `https://player.twitch.tv/?channel=${channel}&parent=${host}`;
    }
    // Kick Channel
    if (url.includes('kick.com/')) {
      const channel = url.split('kick.com/')[1]?.split('?')[0];
      return `https://player.kick.com/${channel}`;
    }
    return url;
  };

  const finalEmbedUrl = getEmbedUrl(streamUrl);

  return (
    <div className="w-full glass-panel rounded-3xl p-4 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 overflow-hidden relative">
      
      {/* Top Stream Bar */}
      <div className="flex items-center justify-between mb-3 px-2 flex-wrap gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-mono font-bold">
            <Radio className="w-4 h-4 animate-ping text-red-400" />
            <span>TRANSMISIÓN EN VIVO</span>
          </div>
          <span className="text-xs text-slate-300 font-mono hidden sm:inline">
            Canal de: <strong>{activeRaffle.admin_name || 'Organizador Admin'}</strong>
          </span>
        </div>

        {isAdmin && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-xs text-cyan-400 font-mono transition-colors shadow-md"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancelar Edición' : 'Editar Link de Transmisión'}</span>
          </button>
        )}
      </div>

      {/* Admin URL Configuration Input Form */}
      {isEditing && (
        <form onSubmit={handleUpdateUrl} className="mb-4 p-3.5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 flex flex-col sm:flex-row gap-2 shadow-inner">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Pegar URL de YouTube Live, Twitch (ej: https://www.youtube.com/watch?v=...) ..."
            className="flex-1 bg-[#06070A] border border-cyan-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-cyan-500 text-black font-extrabold text-xs rounded-xl hover:bg-cyan-400 transition-colors font-mono flex items-center justify-center space-x-1 shadow-md shadow-cyan-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Guardar Link</span>
          </button>
        </form>
      )}

      {/* Main Video Frame */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-cyan-500/20 shadow-inner">
        {finalEmbedUrl ? (
          <iframe
            src={finalEmbedUrl}
            title="Sorteo Live Broadcast"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 p-6">
            <Tv className="w-16 h-16 text-cyan-500/30 mb-3 animate-pulse" />
            <p className="text-sm font-mono">Esperando señal de transmisión en vivo del organizador...</p>
          </div>
        )}
      </div>

    </div>
  );
}
