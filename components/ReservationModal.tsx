'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Send, Copy, Check, CheckCircle2, QrCode, ShieldCheck, Download, ArrowRight } from 'lucide-react';
import QRCode from 'qrcode';
import { useAppStore } from '@/lib/store';
import { RaffleNumber } from '@/lib/types';
import { generateTicketPdf } from '@/lib/pdfUtils';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastname: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  phone: z.string().min(6, 'Ingresá un número de WhatsApp válido'),
});

type FormValues = z.infer<typeof schema>;

interface ReservationModalProps {
  ticket: RaffleNumber | null;
  onClose: () => void;
}

export default function ReservationModal({ ticket, onClose }: ReservationModalProps) {
  const { raffle, settings, updateNumberStatus } = useAppStore();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedAlias, setCopiedAlias] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      lastname: '',
      phone: '',
    }
  });

  // Generate QR Code dynamically from Alias
  useEffect(() => {
    if (settings.alias) {
      QRCode.toDataURL(`mpba://${settings.alias}`, {
        margin: 1,
        width: 240,
        color: { dark: '#00E5FF', light: '#0D1117' },
      })
        .then((url) => setQrCodeUrl(url))
        .catch(() => {});
    }
  }, [settings.alias]);

  if (!ticket) return null;

  const formattedNum = String(ticket.number).padStart(2, '0');

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    // Concurrency check: check if still available
    const success = updateNumberStatus(ticket.number, 'reserved', {
      name: data.name,
      lastname: data.lastname,
      phone: data.phone,
    });

    if (!success) {
      toast.error(`El número ${formattedNum} ya no está disponible. Otro usuario lo reservó antes.`);
      setIsSubmitting(false);
      onClose();
      return;
    }

    toast.success(`¡Número #${formattedNum} reservado con éxito!`);

    // Prepare WhatsApp message:
    // Hola. Reservé el número 14. Nombre: Marcelo, Apellido: Lencina, Teléfono: 351xxxxxxx. Adjunto el comprobante.
    const message = `Hola.\n\nReservé el número ${formattedNum}.\n\nNombre: ${data.name}\nApellido: ${data.lastname}\nTeléfono: ${data.phone}\n\nAdjunto el comprobante.`;
    const waPhone = settings.whatsapp.replace(/\D/g, '');
    const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;

    // Generate PDF Ticket automatically
    try {
      await generateTicketPdf(raffle, {
        ...ticket,
        status: 'reserved',
        user_name: data.name,
        user_lastname: data.lastname,
        phone: data.phone,
      }, settings);
      toast.success('¡Comprobante PDF descargado!');
    } catch (e) {
      console.error('Error generating PDF:', e);
    }

    setIsSubmitting(false);
    onClose();

    // Open WhatsApp
    window.open(waUrl, '_blank');
  };

  const copyAlias = () => {
    navigator.clipboard.writeText(settings.alias);
    setCopiedAlias(true);
    toast.success(`¡Alias "${settings.alias}" copiado al portapapeles!`);
    setTimeout(() => setCopiedAlias(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-lg perspective-1000">
        
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* 3D Flip Expansion Card Container */}
        <motion.div
          layoutId={`number-card-${ticket.number}`}
          initial={{ rotateY: -180, scale: 0.6, opacity: 0 }}
          animate={{ rotateY: 0, scale: 1, opacity: 1 }}
          exit={{ rotateY: 180, scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-full max-w-lg glass-panel-glow rounded-3xl p-5 sm:p-7 border-2 border-cyan-400/60 shadow-2xl shadow-cyan-500/40 z-10 overflow-hidden max-h-[92vh] overflow-y-auto"
        >
          {/* Neon Top Scanline */}
          <div className="scanline-effect absolute inset-0 pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-gray-400 hover:text-white transition-colors border border-cyan-500/30"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Card Back Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 font-mono text-xs mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>DETALLES Y RESERVA</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Número <span className="text-cyan-400 font-mono text-glow-cyan">#{formattedNum}</span>
            </h3>

            <div className="flex items-center justify-center space-x-3 mt-1">
              <span className="text-xs text-slate-300 font-mono">Valor:</span>
              <span className="text-lg font-extrabold font-mono text-emerald-400 text-glow-green">
                ${raffle.price.toLocaleString('es-AR')}
              </span>
            </div>
          </div>

          {/* Bank Transfer Details & Dynamic QR Code */}
          <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 mb-5 bg-slate-950/80">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              
              <div className="space-y-2 text-xs w-full">
                <span className="text-[10px] text-cyan-400 font-mono block uppercase font-bold tracking-wider">
                  DATOS DE TRANSFERENCIA BANCARIA
                </span>
                
                <p className="text-slate-200">
                  Titular: <strong className="text-white font-semibold">{settings.holder}</strong>
                </p>

                {/* Alias Box with Copy Button */}
                <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2 rounded-xl border border-cyan-500/30">
                  <div className="truncate">
                    <span className="text-slate-400 text-[11px] block">Alias CBU:</span>
                    <strong className="text-cyan-300 font-mono text-sm">{settings.alias}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={copyAlias}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/40 transition-colors flex items-center space-x-1 font-mono text-xs"
                  >
                    {copiedAlias ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedAlias ? 'Copiado' : 'Copiar Alias'}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic QR Code for Mobile Scanning */}
              {qrCodeUrl && (
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="p-1.5 rounded-2xl bg-[#0D1117] border border-cyan-500/40 shadow-md">
                    <img src={qrCodeUrl} alt="QR Alias" className="w-20 h-20 rounded-xl" />
                  </div>
                  <span className="text-[9px] font-mono text-cyan-400/90 mt-1 uppercase">Escaneá QR</span>
                </div>
              )}
            </div>

            {/* Payment Instructions */}
            <ol className="mt-3 text-[11px] text-slate-300 space-y-1 border-t border-slate-800/80 pt-2 font-mono">
              <li className="flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Transferí <strong>${raffle.price.toLocaleString('es-AR')}</strong> a la cuenta indicada.</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Completá tus datos y enviá el comprobante por WhatsApp.</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">3</span>
                <span>Confirmaremos tu pago y tu tarjeta cambiará a <strong>VENDIDO</strong>.</span>
              </li>
            </ol>
          </div>

          {/* Reservation Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Nombre</label>
                <input
                  {...register('name')}
                  placeholder="Ej. Marcelo"
                  className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
                />
                {errors.name && <p className="text-red-400 text-[11px] mt-1 font-mono">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Apellido</label>
                <input
                  {...register('lastname')}
                  placeholder="Ej. Lencina"
                  className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
                />
                {errors.lastname && <p className="text-red-400 text-[11px] mt-1 font-mono">{errors.lastname.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">WhatsApp / Teléfono</label>
              <input
                {...register('phone')}
                placeholder="Ej. 351xxxxxxx"
                className="w-full bg-[#06070A] border border-cyan-500/30 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono"
              />
              {errors.phone && <p className="text-red-400 text-[11px] mt-1 font-mono">{errors.phone.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-black font-extrabold text-base tracking-wide shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 flex items-center justify-center space-x-2 mt-2"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Reservando...' : 'Reservar Número'}</span>
            </button>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
