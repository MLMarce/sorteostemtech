import { createClient } from '@supabase/supabase-js';
import { Raffle, RaffleNumber, Settings, DrawHistory } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial Mock Data to allow 100% immediate out-of-the-box demo & testing
const INITIAL_RAFFLE: Raffle = {
  id: 'raf-ps5-001',
  title: 'Gran Sorteo TEMTECH',
  description: '¡Participá por la nueva PlayStation 5 Slim 1TB con 2 controles DualSense! Transmisión en vivo por YouTube y Twitch.',
  prize: 'PlayStation 5',
  image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
  banner_image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
  price: 5000,
  total_numbers: 100,
  draw_date: '2026-08-20',
  draw_time: '21:00',
  status: 'active',
  primary_color: '#00E5FF',
  slug: 'ps5-slim-1tb',
  created_at: new Date().toISOString()
};

const INITIAL_SETTINGS: Settings = {
  alias: 'marceloenkihaa',
  holder: 'Marcelo Lencina',
  whatsapp: '3518509827',
  instagram: '@temtech.studio',
  facebook: 'temtechstudio',
  logo: 'TEMTECH Sorteos',
  primary_color: '#00E5FF',
  auto_message: 'Hola. Reservé el número {number}. Nombre: {name}, Apellido: {lastname}, Teléfono: {phone}. Adjunto el comprobante.'
};

// Generate 100 numbers with 63 available, 22 paid, 15 reserved
const presetPaidNumbers = [3, 7, 12, 18, 22, 28, 31, 35, 40, 44, 49, 53, 58, 62, 67, 71, 75, 80, 84, 89, 93, 98];
const presetReservedNumbers = [5, 9, 14, 21, 33, 47, 50, 60, 66, 73, 79, 86, 91, 95, 99];

function buildInitialNumbers(): RaffleNumber[] {
  const list: RaffleNumber[] = [];
  for (let i = 1; i <= 100; i++) {
    let status: 'available' | 'reserved' | 'paid' = 'available';
    let user_name = undefined;
    let user_lastname = undefined;
    let phone = undefined;

    if (presetPaidNumbers.includes(i)) {
      status = 'paid';
      user_name = i % 2 === 0 ? 'Carlos' : 'Valeria';
      user_lastname = i % 2 === 0 ? 'Gómez' : 'Fernández';
      phone = '3515550199';
    } else if (presetReservedNumbers.includes(i)) {
      status = 'reserved';
      user_name = i === 14 ? 'Marcelo' : 'Lucía';
      user_lastname = i === 14 ? 'Lencina' : 'Ríos';
      phone = '3514440288';
    }

    list.push({
      id: `num-${i}`,
      raffle_id: 'raf-ps5-001',
      number: i,
      status,
      user_name,
      user_lastname,
      phone,
      reserved_at: status !== 'available' ? new Date().toISOString() : undefined,
      paid_at: status === 'paid' ? new Date().toISOString() : undefined,
    });
  }
  return list;
}

// LocalStorage Persistence Wrapper for Mock Mode
const LOCAL_STORAGE_KEY_NUMBERS = 'temtech_raffle_numbers_v1';
const LOCAL_STORAGE_KEY_RAFFLE = 'temtech_raffle_v1';
const LOCAL_STORAGE_KEY_SETTINGS = 'temtech_settings_v1';
const LOCAL_STORAGE_KEY_HISTORY = 'temtech_draw_history_v1';

export function getMockRaffle(): Raffle {
  if (typeof window === 'undefined') return INITIAL_RAFFLE;
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY_RAFFLE);
  return saved ? JSON.parse(saved) : INITIAL_RAFFLE;
}

export function saveMockRaffle(raffle: Raffle): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY_RAFFLE, JSON.stringify(raffle));
  }
}

export function getMockNumbers(): RaffleNumber[] {
  if (typeof window === 'undefined') return buildInitialNumbers();
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY_NUMBERS);
  if (saved) return JSON.parse(saved);
  const initial = buildInitialNumbers();
  localStorage.setItem(LOCAL_STORAGE_KEY_NUMBERS, JSON.stringify(initial));
  return initial;
}

export function saveMockNumbers(numbers: RaffleNumber[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY_NUMBERS, JSON.stringify(numbers));
    window.dispatchEvent(new Event('raffle-numbers-updated'));
  }
}

export function getMockSettings(): Settings {
  if (typeof window === 'undefined') return INITIAL_SETTINGS;
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
  return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
}

export function saveMockSettings(settings: Settings): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    window.dispatchEvent(new Event('settings-updated'));
  }
}

export function getMockHistory(): DrawHistory[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY_HISTORY);
  return saved ? JSON.parse(saved) : [];
}

export function saveMockWinnerHistory(record: DrawHistory): void {
  if (typeof window !== 'undefined') {
    const list = getMockHistory();
    list.unshift(record);
    localStorage.setItem(LOCAL_STORAGE_KEY_HISTORY, JSON.stringify(list));
  }
}
