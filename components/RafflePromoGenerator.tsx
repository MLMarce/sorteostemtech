'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, MessageCircle, Image as ImageIcon, Loader2, Share2, Sparkles, Flame } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Raffle, RaffleNumber } from '@/lib/types';
import { toast } from 'sonner';

const InstagramIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

type Format = 'post' | 'story' | 'square';

interface RafflePromoGeneratorProps {
  raffle: Raffle;
  numbers: RaffleNumber[];
  onClose: () => void;
}

const FORMAT_CONFIG: Record<Format, { label: string; icon: React.ReactNode; width: number; height: number; desc: string }> = {
  post: {
    label: 'Post Instagram',
    icon: <InstagramIcon className="w-4 h-4" />,
    width: 1080,
    height: 1080,
    desc: '1:1 — Publicación cuadrada (Feed)',
  },
  story: {
    label: 'Historia / Estado',
    icon: <MessageCircle className="w-4 h-4" />,
    width: 1080,
    height: 1920,
    desc: '9:16 — Historia Instagram / Estado WhatsApp',
  },
  square: {
    label: 'Post Compacto',
    icon: <ImageIcon className="w-4 h-4" />,
    width: 800,
    height: 800,
    desc: '1:1 — Versión compacta para compartir',
  },
};

export default function RafflePromoGenerator({ raffle, numbers, onClose }: RafflePromoGeneratorProps) {
  const [format, setFormat] = useState<Format>('post');
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const availableCount = numbers.filter(n => n.status === 'available').length;
  const reservedCount = numbers.filter(n => n.status === 'reserved').length;
  const paidCount = numbers.filter(n => n.status === 'paid' || n.status === 'winner').length;
  const totalCount = numbers.length;
  const soldPct = totalCount > 0 ? Math.round(((reservedCount + paidCount) / totalCount) * 100) : 0;

  // Convert raffle image to base64 Data URL to prevent CORS/tainted canvas issues
  useEffect(() => {
    let active = true;
    if (!raffle.image) {
      setBase64Image(null);
      return;
    }

    if (raffle.image.startsWith('data:')) {
      setBase64Image(raffle.image);
      return;
    }

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          if (active) setBase64Image(dataURL);
        }
      } catch (err) {
        console.warn('Could not convert remote image to base64 due to CORS:', err);
        if (active) setBase64Image(null);
      }
    };
    img.onerror = () => {
      if (active) setBase64Image(null);
    };
    img.src = raffle.image;

    return () => {
      active = false;
    };
  }, [raffle.image]);

  const previewNums = numbers.slice(0, Math.min(totalCount, 50));

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const element = previewRef.current;

      const canvas = await html2canvas(element, {
        scale: 2, // High resolution output
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#060710',
        logging: false,
      });

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `promo_${raffle.slug || 'sorteo'}_${format}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`¡Imagen "${FORMAT_CONFIG[format].label}" descargada con éxito!`);
    } catch (err) {
      console.error('Error generating image:', err);
      toast.error('Hubo un problema al generar la imagen. Intenta nuevamente.');
    } finally {
      setGenerating(false);
    }
  };

  const isStory = format === 'story';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0"
      />

      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-5xl glass-panel-glow rounded-3xl border-2 border-violet-400/50 shadow-2xl shadow-violet-500/30 z-10 flex flex-col max-h-[95vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-500/30 to-pink-500/30 border border-violet-500/40 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Crear Publicidad</h2>
              <p className="text-xs text-slate-400 font-mono truncate max-w-xs">{raffle.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
          {/* Left: Controls */}
          <div className="w-full lg:w-72 flex-shrink-0 p-5 border-b lg:border-b-0 lg:border-r border-slate-800 space-y-5 overflow-y-auto">

            <div>
              <label className="block text-xs font-mono text-violet-300 mb-2 uppercase tracking-wider font-bold">
                Formato de Imagen
              </label>
              <div className="space-y-2">
                {(Object.entries(FORMAT_CONFIG) as [Format, typeof FORMAT_CONFIG[Format]][]).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setFormat(key)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      format === key
                        ? 'border-violet-500 bg-violet-950/60'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-0.5">
                      <span className={format === key ? 'text-violet-400' : 'text-slate-400'}>{cfg.icon}</span>
                      <span className={`text-xs font-bold font-mono ${format === key ? 'text-violet-300' : 'text-slate-300'}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{cfg.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <span className="text-slate-400 uppercase text-[10px] tracking-wider block font-bold">Estado del Cartón</span>
              <div className="flex justify-between">
                <span className="text-emerald-400">Disponibles</span>
                <span className="text-white font-bold">{availableCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-400">Reservados</span>
                <span className="text-white font-bold">{reservedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-400">Vendidos</span>
                <span className="text-white font-bold">{paidCount}</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-violet-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${soldPct}%` }}
                />
              </div>
              <span className="text-slate-400">{soldPct}% vendido</span>
            </div>

            <button
              onClick={handleDownload}
              disabled={generating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-600 hover:from-violet-400 hover:to-pink-500 text-white font-extrabold text-sm font-mono tracking-wide shadow-lg shadow-violet-500/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generando Imagen...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar Flyer HD (PNG)</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-slate-500 font-mono text-center">
              Diseño adaptado para publicaciones en Instagram y estados de WhatsApp.
            </p>
          </div>

          {/* Right: Preview Canvas Container */}
          <div className="flex-1 p-5 flex items-start justify-center overflow-y-auto bg-slate-950/50 min-h-0">
            <div className={`w-full flex items-start justify-center ${isStory ? 'max-w-[260px]' : 'max-w-[380px]'}`}>
              
              {/* Element that gets captured by html2canvas */}
              <div
                ref={previewRef}
                className={`relative overflow-hidden rounded-2xl w-full border border-cyan-500/40 ${isStory ? 'aspect-[9/16]' : 'aspect-square'}`}
                style={{ backgroundColor: '#07090E', color: '#FFFFFF' }}
              >
                {/* Background image if available */}
                {(base64Image || raffle.image) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={base64Image || raffle.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-25"
                    crossOrigin="anonymous"
                  />
                )}

                {/* Dark Gradient Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, rgba(6,7,16,0.7) 0%, rgba(6,7,16,0.6) 40%, rgba(6,7,16,0.98) 100%)',
                  }}
                />

                {/* Decorative border */}
                <div className="absolute inset-0 rounded-2xl border border-cyan-400/30 pointer-events-none" />

                {/* Main Content */}
                <div className={`relative z-10 flex flex-col h-full ${isStory ? 'p-5' : 'p-4'}`}>

                  {/* Top Header Bar */}
                  <div className="flex items-center justify-between mb-2.5 flex-shrink-0">
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-400/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      <span className="text-red-300 font-mono font-bold uppercase tracking-wider" style={{ fontSize: isStory ? '9px' : '8px' }}>
                        GRAN SORTEO
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px' }}>
                        <rect width="20" height="20" rx="4" fill="#0D1117"/>
                        <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="#00E5FF" strokeOpacity="0.6" strokeWidth="1"/>
                        <rect x="4" y="5.5" width="12" height="2.5" rx="1" fill="#00E5FF"/>
                        <rect x="8" y="8" width="4" height="7" rx="1" fill="#7C3AED"/>
                      </svg>
                      <span className="font-extrabold text-cyan-400" style={{ fontSize: isStory ? '11px' : '9px', letterSpacing: '0.5px' }}>
                        TEMTECH
                      </span>
                    </div>
                  </div>

                  {/* Story featured image */}
                  {isStory && (base64Image || raffle.image) && (
                    <div className="relative w-full rounded-xl overflow-hidden mb-3 flex-shrink-0" style={{ height: '150px' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={base64Image || raffle.image}
                        alt=""
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(0deg, rgba(6,7,16,0.85) 0%, transparent 60%)' }}
                      />
                    </div>
                  )}

                  {/* Title */}
                  <h1
                    className="font-extrabold text-white leading-tight mb-2 flex-shrink-0"
                    style={{ fontSize: isStory ? '18px' : '15px', lineHeight: 1.25 }}
                  >
                    {raffle.title}
                  </h1>

                  {/* Prize Highlight Box */}
                  <div
                    className="mb-2.5 flex-shrink-0 flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-amber-400/50 self-start"
                    style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)' }}
                  >
                    <span style={{ fontSize: isStory ? '13px' : '11px' }}>🏆</span>
                    <span className="text-amber-300 font-bold" style={{ fontSize: isStory ? '12px' : '10px' }}>
                      {raffle.prize}
                    </span>
                  </div>

                  {/* Info badges */}
                  <div className="flex items-center flex-wrap gap-1.5 mb-2.5 flex-shrink-0">
                    <div className="px-2.5 py-1 rounded-lg border border-cyan-500/40" style={{ backgroundColor: 'rgba(0, 229, 255, 0.12)' }}>
                      <span className="text-cyan-300 font-mono font-bold" style={{ fontSize: isStory ? '9.5px' : '8.5px' }}>
                        📅 {raffle.draw_date}
                      </span>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg border border-emerald-500/40" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)' }}>
                      <span className="text-emerald-300 font-mono font-bold" style={{ fontSize: isStory ? '9.5px' : '8.5px' }}>
                        💰 ${raffle.price?.toLocaleString('es-AR')} por número
                      </span>
                    </div>
                  </div>

                  {/* Numbers Grid Availability */}
                  <div className="flex-1 min-h-0 mb-3">
                    <div className="text-slate-400 font-mono mb-1 font-bold" style={{ fontSize: '7.5px' }}>
                      DISPONIBILIDAD ({availableCount} LIBRES DE {totalCount})
                    </div>
                    <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' }}>
                      {previewNums.map((n) => (
                        <div
                          key={n.id}
                          className="rounded-sm flex items-center justify-center font-mono font-bold"
                          style={{
                            aspectRatio: '1',
                            backgroundColor:
                              n.status === 'available' ? 'rgba(16,185,129,0.35)' :
                              n.status === 'reserved' ? 'rgba(245,158,11,0.35)' :
                              'rgba(239,68,68,0.35)',
                            fontSize: '6px',
                            color:
                              n.status === 'available' ? '#6ee7b7' :
                              n.status === 'reserved' ? '#fcd34d' : '#fca5a5',
                          }}
                        >
                          {String(n.number).padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center space-x-3 mt-1.5">
                      {[['#6ee7b7', 'Libre'], ['#fcd34d', 'Reservado'], ['#fca5a5', 'Vendido']].map(([color, label]) => (
                        <div key={label} className="flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                          <span style={{ fontSize: '7px', color: '#cbd5e1', fontFamily: 'monospace' }}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom: Call to Action Banner (Without QR) */}
                  <div className="flex items-center justify-between mt-auto flex-shrink-0 pt-2.5 border-t border-slate-800/80">
                    <div>
                      <div
                        className="font-extrabold text-cyan-400"
                        style={{ fontSize: isStory ? '13px' : '11px' }}
                      >
                        ¡Elegí tu número antes que se agoten!
                      </div>
                      <div className="text-slate-400 font-mono" style={{ fontSize: isStory ? '8.5px' : '7.5px' }}>
                        Pedí tu número ahora por WhatsApp
                      </div>
                    </div>

                    <div
                      className="px-3 py-1.5 rounded-xl border border-violet-400/50 flex items-center space-x-1.5"
                      style={{ backgroundColor: 'rgba(124, 58, 237, 0.2)' }}
                    >
                      <span style={{ fontSize: '10px' }}>🔥</span>
                      <span className="text-violet-300 font-mono font-bold uppercase tracking-wider" style={{ fontSize: isStory ? '9px' : '8px' }}>
                        Cupos Limitados
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
