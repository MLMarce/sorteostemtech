import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Raffle, RaffleNumber, Settings } from './types';

export async function generateTicketPdf(
  raffle: Raffle,
  ticket: RaffleNumber,
  settings: Settings
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [100, 150], // Compact aesthetic receipt format
  });

  // Background
  doc.setFillColor(6, 7, 10);
  doc.rect(0, 0, 100, 150, 'F');

  // Header Border Glow
  doc.setDrawColor(0, 229, 255);
  doc.setLineWidth(0.8);
  doc.rect(4, 4, 92, 142);

  // Brand Title
  doc.setTextColor(0, 229, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('TEMTECH STUDIO', 50, 15, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('COMPROBANTE DE RESERVA', 50, 21, { align: 'center' });

  // Divider Line
  doc.setDrawColor(0, 229, 255);
  doc.setLineWidth(0.3);
  doc.line(10, 25, 90, 25);

  // Raffle Info
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(raffle.title, 50, 32, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text(`Premio: ${raffle.prize}`, 50, 37, { align: 'center' });

  // Ticket Box
  doc.setFillColor(13, 17, 23);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(20, 43, 60, 25, 3, 3, 'FD');

  doc.setFontSize(10);
  doc.setTextColor(16, 185, 129);
  doc.text('NÚMERO RESERVADO', 50, 50, { align: 'center' });

  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 229, 255);
  const formattedNum = String(ticket.number).padStart(2, '0');
  doc.text(`# ${formattedNum}`, 50, 62, { align: 'center' });

  // Participant Data Box
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 213, 219);
  
  doc.text(`Participante: ${ticket.user_name || ''} ${ticket.user_lastname || ''}`, 10, 76);
  doc.text(`Teléfono: ${ticket.phone || 'No indicado'}`, 10, 82);
  doc.text(`Valor a transferir: $${raffle.price.toLocaleString('es-AR')}`, 10, 88);
  doc.text(`Alias CBU: ${settings.alias}`, 10, 94);
  doc.text(`Titular: ${settings.holder}`, 10, 100);
  doc.text(`Fecha del Sorteo: ${raffle.draw_date}`, 10, 106);

  // Generate QR Code for Alias
  try {
    const qrDataUrl = await QRCode.toDataURL(`mpba://${settings.alias}`, {
      margin: 1,
      width: 100,
      color: {
        dark: '#00E5FF',
        light: '#0D1117',
      },
    });
    doc.addImage(qrDataUrl, 'PNG', 35, 112, 30, 30);
  } catch (e) {
    console.error('Failed to generate QR for PDF:', e);
  }

  // Footer text
  doc.setFontSize(6);
  doc.setTextColor(107, 114, 128);
  doc.text('Enviá tu comprobante de pago por WhatsApp para confirmar tu número.', 50, 144, { align: 'center' });

  // Save PDF
  doc.save(`Ticket_TEMTECH_Num_${formattedNum}.pdf`);
}
