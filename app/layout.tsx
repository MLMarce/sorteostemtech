import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const viewport: Viewport = {
  themeColor: '#00E5FF',
};

export const metadata: Metadata = {
  title: 'Sorteos TEMTECH - Sorteos y Rifas Online Futuristas',
  description: 'Plataforma interactiva en tiempo real para sorteos online, rifas y transmisiones en vivo con diseño cyberpunk holográfico.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="bg-[#06070A] text-slate-100 min-h-screen flex flex-col cyber-grid-bg selection:bg-cyan-500 selection:text-black">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="glass-panel border-t border-cyan-500/20 py-8 px-4 text-center mt-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div>
              <span className="text-cyan-400 font-bold">TEMTECH Studio</span> © {new Date().getFullYear()} — Plataforma de Sorteos Holográficos.
            </div>
            <div className="flex space-x-4">
              <a href="https://instagram.com/temtech_studio" target="_blank" rel="noreferrer" className="hover:text-cyan-400">Instagram</a>
              <a href="https://facebook.com/temtechstudio" target="_blank" rel="noreferrer" className="hover:text-cyan-400">Facebook</a>
              <a href="https://wa.me/3518509827" target="_blank" rel="noreferrer" className="hover:text-cyan-400">WhatsApp</a>
            </div>
          </div>
        </footer>

        {/* Futuristic Toaster */}
        <Toaster 
          theme="dark" 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(13, 17, 23, 0.95)',
              border: '1px solid rgba(0, 229, 255, 0.4)',
              color: '#F3F4F6',
              boxShadow: '0 0 20px rgba(0, 229, 255, 0.25)',
              borderRadius: '12px',
              fontFamily: 'monospace',
            }
          }}
        />
      </body>
    </html>
  );
}
