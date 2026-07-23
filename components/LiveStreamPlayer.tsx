'use client';

import React, { useState } from 'react';
import { Tv, Play, Settings, Radio } from 'lucide-react';

interface LiveStreamPlayerProps {
  initialUrl?: string;
}

export default function LiveStreamPlayer({ initialUrl = 'https://www.youtube.com/embed/live_stream?channel=TEMTECH' }: LiveStreamPlayerProps) {
  const [streamUrl, setStreamUrl] = useState(initialUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [inputUrl, setInputUrl] = useState(initialUrl);

  const handleUpdateUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setStreamUrl(inputUrl);
    setIsEditing(false);
  };

  // Helper to format YouTube or Twitch URLs into embed format if needed
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    if (url.includes('twitch.tv/')) {
      const channel = url.split('twitch.tv/')[1]?.split('?')[0];
      return `https://player.twitch.tv/?channel=${channel}&parent=${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}`;
    }
    return url;
  };

  const finalEmbedUrl = getEmbedUrl(streamUrl);

  return (
    <div className="w-full glass-panel rounded-3xl p-4 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 overflow-hidden relative">
      
      {/* Top Stream Bar */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-mono font-bold">
            <Radio className="w-4 h-4 animate-ping text-red-400" />
            <span>TRANSMISIÓN EN VIVO</span>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Estudio Sorteos TEMTECH</span>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-xs text-cyan-400 font-mono transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Configurar URL</span>
        </button>
      </div>

      {/* URL Configuration Input Form */}
      {isEditing && (
        <form onSubmit={handleUpdateUrl} className="mb-4 p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/30 flex gap-2">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Pegar URL de YouTube Live, Twitch, Kick o iframe embed..."
            className="flex-1 bg-[#06070A] border border-cyan-500/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-cyan-500 text-black font-extrabold text-xs rounded-xl hover:bg-cyan-400 transition-colors font-mono"
          >
            Guardar
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
            <p className="text-sm font-mono">Esperando señal de transmisión en vivo...</p>
          </div>
        )}
      </div>

    </div>
  );
}
