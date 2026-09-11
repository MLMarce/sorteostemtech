'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, MessageCircle, Image, Loader2, Share2, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';
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
    desc: '1:1 — Publicacion cuadrada',
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
    icon: <Image className="w-4 h-4" />,
    width: 800,
    height: 800,
    desc: '1:1 — Version compacta para compartir',
  },
};

export default function RafflePromoGenerator({ raffle, numbers, onClose }: RafflePromoGeneratorProps) {
  const [format, setFormat] = useState<Format>('post');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [generating, setGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const availableCount = numbers.filter(n => n.status === 'available').length;
  const reservedCount = numbers.filter(n => n.status === 'reserved').length;
  const paidCount = numbers.filter(n => n.status === 'paid' || n.status === 'winner').length;
  const totalCount = numbers.length;
  const soldPct = totalCount > 0 ? Math.round(((reservedCount + paidCount) / totalCount) * 100) : 0;

  useEffect(() => {
    const raffleUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/sorteo?id=${raffle.id}`
      : `https://temtech.com/sorteo?id=${raffle.id}`;

    QRCode.toDataURL(raffleUrl, {
      margin: 1,
      width: 280,
      color: { dark: '#00E5FF', light: '#0D1117' },
      errorCorrectionLevel: 'M',
    })
      .then(setQrDataUrl)
      .catch(() => {});
  }, [raffle.id]);

  const previewNums = numbers.slice(0, Math.min(totalCount, 50));

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setGenerating(true);
    try {
      const cfg = FORMAT_CONFIG[format];
      const canvas = await html2canvas(previewRef.current, {
        scale: cfg.width / previewRef.current.offsetWidth,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#060710',
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `promo_${raffle.slug || 'sorteo'}_${format}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      toast.success(`Imagen "${FORMAT_CONFIG[format].label}" descargada!`);
    } catch (err) {
      console.error('Error generating image:', err);
      toast.error('Error al generar la imagen. Intenta de nuevo.');
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
              <label className="block text-xs font-mono text-violet-300 mb-2 uppercase tracking-wider">Formato</label>
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
              <span className="text-slate-400 uppercase text-[10px] tracking-wider block">Estado del carton</span>
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
              disabled={generating || !qrDataUrl}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-600 hover:from-violet-400 hover:to-pink-500 text-white font-extrabold text-sm font-mono tracking-wide shadow-lg shadow-violet-500/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar PNG</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-slate-500 font-mono text-center">
              La imagen se descarga lista para compartir en redes sociales.
            </p>
          </div>

          {/* Right: Preview */}
          <div className="flex-1 p-5 flex items-start justify-center overflow-y-auto bg-slate-950/50 min-h-0">
            <div className={`w-full flex items-start justify-center ${isStory ? 'max-w-[220px]' : 'max-w-[380px]'}`}>
              <div
                ref={previewRef}
                className={`relative overflow-hidden rounded-2xl shadow-2xl w-full ${isStory ? 'aspect-[9/16]' : 'aspect-square'}`}
                style={{ fontFamily: 'system-ui, sans-serif', background: '#06070A' }}
              >
                {/* Background image */}
                {raffle.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={raffle.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                    crossOrigin="anonymous"
                  />
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#060710]/60 via-[#060710]/50 to-[#060710]/95" />
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/30 via-transparent to-cyan-900/20" />
                <div className="absolute top-0 left-0 w-24 h-24 bg-cyan-500/20 blur-2xl rounded-full" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-violet-500/20 blur-2xl rounded-full" />
                <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/30 pointer-events-none" />

                {/* Content */}
                <div className={`relative z-10 flex flex-col h-full ${isStory ? 'p-5' : 'p-4'}`}>

                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-3 flex-shrink-0">
                    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-400/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      <span className="text-red-300 font-mono font-bold uppercase tracking-wider" style={{ fontSize: isStory ? '9px' : '8px' }}>
                        SORTEO EN VIVO
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px' }}>
                        <rect width="20" height="20" rx="4" fill="#0D1117"/>
                        <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="#00E5FF" strokeOpacity="0.6" strokeWidth="1"/>
                        <rect x="4" y="5.5" width="12" height="2.5" rx="1" fill="#00E5FF"/>
                        <rect x="8" y="8" width="4" height="7" rx="1" fill="#7C3AED"/>
                      </svg>
                      <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400" style={{ fontSize: isStory ? '11px' : '9px' }}>
                        TEMTECH
                      </span>
                    </div>
                  </div>

                  {/* Story: prize image */}
                  {isStory && raffle.image && (
                    <div className="relative w-full rounded-xl overflow-hidden mb-3 flex-shrink-0" style={{ height: '150px' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={raffle.image} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#060710]/80 to-transparent" />
                    </div>
                  )}

                  {/* Title */}
                  <h1
                    className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-violet-300 leading-tight mb-2 flex-shrink-0"
                    style={{ fontSize: isStory ? '18px' : '14px', lineHeight: 1.2 }}
                  >
                    {raffle.title}
                  </h1>

                  {/* Prize */}
                  <div className="mb-2 flex-shrink-0 flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border border-amber-400/40 bg-amber-400/10 self-start">
                    <span style={{ fontSize: isStory ? '12px' : '10px' }}>🏆</span>
                    <span className="text-amber-300 font-bold" style={{ fontSize: isStory ? '11px' : '9px' }}>
                      {raffle.prize}
                    </span>
                  </div>

                  {/* Info pills */}
                  <div className="flex items-center flex-wrap gap-1.5 mb-3 flex-shrink-0">
                    <div className="px-2 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30">
                      <span className="text-cyan-300 font-mono font-bold" style={{ fontSize: isStory ? '9px' : '8px' }}>
                        📅 {raffle.draw_date}
                      </span>
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
                      <span className="text-emerald-300 font-mono font-bold" style={{ fontSize: isStory ? '9px' : '8px' }}>
                        💰 ${raffle.price?.toLocaleString('es-AR')} c/n
                      </span>
                    </div>
                  </div>

                  {/* Numbers grid */}
                  <div className="flex-1 min-h-0 mb-3">
                    <div className="text-slate-400 font-mono mb-1" style={{ fontSize: '7px' }}>
                      DISPONIBILIDAD — {availableCount} LIBRES DE {totalCount}
                    </div>
                    <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' }}>
                      {previewNums.map((n) => (
                        <div
                          key={n.id}
                          className="rounded-sm flex items-center justify-center"
                          style={{
                            aspectRatio: '1',
                            backgroundColor:
                              n.status === 'available' ? 'rgba(16,185,129,0.4)' :
                              n.status === 'reserved' ? 'rgba(245,158,11,0.4)' :
                              'rgba(239,68,68,0.4)',
                            fontSize: '5.5px',
                            color:
                              n.status === 'available' ? '#6ee7b7' :
                              n.status === 'reserved' ? '#fcd34d' : '#fca5a5',
                            fontWeight: 700,
                            fontFamily: 'monospace',
                          }}
                        >
                          {String(n.number).padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {[['#6ee7b7', 'Disponible'], ['#fcd34d', 'Reservado'], ['#fca5a5', 'Vendido']].map(([color, label]) => (
                        <div key={label} className="flex items-center space-x-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                          <span style={{ fontSize: '6px', color: '#94a3b8', fontFamily: 'monospace' }}>{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom: CTA + QR */}
                  <div className="flex items-end justify-between mt-auto flex-shrink-0">
                    <div className="flex-1 pr-3">
                      <div
                        className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 mb-0.5"
                        style={{ fontSize: isStory ? '12px' : '10px' }}
                      >
                        Elegí tu número ahora!
                      </div>
                      <div className="text-slate-400 font-mono" style={{ fontSize: '7px' }}>
                        Escaneá el QR para participar
                      </div>
                    </div>
                    {qrDataUrl && (
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="p-1 rounded-lg bg-[#0D1117] border border-cyan-500/50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={qrDataUrl}
                            alt="QR Sorteo"
                            style={{ width: isStory ? '70px' : '54px', height: isStory ? '70px' : '54px', display: 'block' }}
                          />
                        </div>
                        <span className="text-cyan-400 font-mono mt-0.5" style={{ fontSize: '6px' }}>
                          SORTEO ONLINE
                        </span>
                      </div>
                    )}
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
