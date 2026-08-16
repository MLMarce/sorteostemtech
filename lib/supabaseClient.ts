import { createClient } from '@supabase/supabase-js';
import { Raffle, RaffleNumber, Settings, DrawHistory, AdminProfile } from './types';

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

// Initial 3 Sample Admin Accounts for SaaS demo
export const INITIAL_ADMINS: AdminProfile[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin1@temtech.com',
    full_name: 'Marcelo Tech (Admin 1)',
    role: 'admin',
    subscription_plan: 'pro',
    live_stream_url: 'https://www.youtube.com/embed/5qap5aO4i9A',
    created_at: new Date().toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'admin2@temtech.com',
    full_name: 'Valeria Gamer (Admin 2)',
    role: 'admin',
    subscription_plan: 'ilimitado',
    live_stream_url: 'https://www.youtube.com/embed/2g811Eo7K8U',
    created_at: new Date().toISOString()
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'admin3@temtech.com',
    full_name: 'Lucas Sorteos (Admin 3)',
    role: 'admin',
    subscription_plan: 'gratis',
    live_stream_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    created_at: new Date().toISOString()
  }
];

// Initial 3 Active Raffles from 3 different admins
export const INITIAL_RAFFLES: Raffle[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    admin_id: '00000000-0000-0000-0000-000000000001',
    admin_name: 'Marcelo Tech',
    title: 'Gran Sorteo PlayStation 5 Slim 1TB',
    description: '¡Participá por la nueva PlayStation 5 Slim 1TB con 2 controles DualSense! Transmisión en vivo oficial desde el canal del creador Marcelo Tech.',
    prize: 'PlayStation 5 Slim 1TB + 2 Joysticks',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
    banner_image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80',
    price: 5000,
    total_numbers: 100,
    draw_date: '2026-08-25',
    draw_time: '21:00',
    status: 'active',
    primary_color: '#00E5FF',
    slug: 'ps5-slim-1tb-marcelo',
    live_stream_url: 'https://www.youtube.com/embed/5qap5aO4i9A',
    created_at: new Date().toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    admin_id: '00000000-0000-0000-0000-000000000002',
    admin_name: 'Valeria Gamer',
    title: 'Sorteo Exclusivo iPhone 15 Pro Max 256GB',
    description: '¡Llévate el iPhone 15 Pro Max Titán Natural nuevo en caja sellada! Sorteo en directo por Twitch y YouTube transmitido por Valeria Gamer.',
    prize: 'iPhone 15 Pro Max 256GB',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
    banner_image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80',
    price: 8500,
    total_numbers: 100,
    draw_date: '2026-08-28',
    draw_time: '22:00',
    status: 'active',
    primary_color: '#FF0055',
    slug: 'iphone-15-pro-max-valeria',
    live_stream_url: 'https://www.youtube.com/embed/2g811Eo7K8U',
    created_at: new Date().toISOString()
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    admin_id: '00000000-0000-0000-0000-000000000003',
    admin_name: 'Lucas Sorteos',
    title: 'Sorteo Moto Honda Wave 110cc 0km',
    description: '¡Ganá una Moto Honda Wave 110cc 0km recién sacada de concesionaria! Transmisión en vivo comandada en directo por Lucas Sorteos VIP.',
    prize: 'Moto Honda Wave 110cc 0km',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80',
    banner_image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1600&q=80',
    price: 12000,
    total_numbers: 100,
    draw_date: '2026-09-01',
    draw_time: '20:00',
    status: 'active',
    primary_color: '#10B981',
    slug: 'honda-wave-110-lucas',
    live_stream_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    created_at: new Date().toISOString()
  }
];

export const INITIAL_SETTINGS: Settings = {
  alias: 'marcelo.temtech.mp',
  holder: 'Marcelo Lencina',
  whatsapp: '5493518509827',
  instagram: '@temtech.studio',
  facebook: 'temtechstudio',
  logo: 'TEMTECH Sorteos',
  primary_color: '#00E5FF',
  auto_message: 'Hola. Reservé el número {number}. Nombre: {name}, Apellido: {lastname}, Teléfono: {phone}. Adjunto comprobante.',
  live_stream_url: 'https://www.youtube.com/embed/5qap5aO4i9A'
};

// Preset paid and reserved number distributions for sample raffles
const presetPaid1 = [3, 7, 12, 18, 22, 28, 31, 35, 40, 44, 49, 53, 58, 62, 67, 71, 75, 80, 84, 89, 93, 98];
const presetReserved1 = [5, 9, 14, 21, 33, 47, 50, 60, 66, 73, 79, 86, 91, 95, 99];

export function buildInitialNumbersForRaffle(raffleId: string): RaffleNumber[] {
  const list: RaffleNumber[] = [];
  for (let i = 1; i <= 100; i++) {
    let status: 'available' | 'reserved' | 'paid' = 'available';
    let user_name = undefined;
    let user_lastname = undefined;
    let phone = undefined;

    if (presetPaid1.includes(i)) {
      status = 'paid';
      user_name = i % 2 === 0 ? 'Carlos' : 'Valeria';
      user_lastname = i % 2 === 0 ? 'Gómez' : 'Fernández';
      phone = '3515550199';
    } else if (presetReserved1.includes(i)) {
      status = 'reserved';
      user_name = i === 14 ? 'Marcelo' : 'Lucía';
      user_lastname = i === 14 ? 'Lencina' : 'Ríos';
      phone = '3514440288';
    }

    list.push({
      id: `num-${raffleId}-${i}`,
      raffle_id: raffleId,
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
const LOCAL_STORAGE_KEY_RAFFLES = 'temtech_saas_raffles_v2';
const LOCAL_STORAGE_KEY_SETTINGS = 'temtech_saas_settings_v2';
const LOCAL_STORAGE_KEY_NUMBERS_PREFIX = 'temtech_saas_numbers_';
const LOCAL_STORAGE_KEY_HISTORY = 'temtech_saas_history_v2';
const LOCAL_STORAGE_KEY_ACTIVE_ADMIN = 'temtech_saas_active_admin_v2';

export function getMockRaffles(): Raffle[] {
  if (typeof window === 'undefined') return INITIAL_RAFFLES;
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY_RAFFLES);
  return saved ? JSON.parse(saved) : INITIAL_RAFFLES;
}

export function saveMockRaffles(raffles: Raffle[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY_RAFFLES, JSON.stringify(raffles));
    window.dispatchEvent(new Event('raffles-updated'));
  }
}

export function getMockRaffle(): Raffle {
  const list = getMockRaffles();
  return list[0] || INITIAL_RAFFLES[0];
}

export function saveMockRaffle(raffle: Raffle): void {
  const list = getMockRaffles();
  const index = list.findIndex(r => r.id === raffle.id);
  if (index >= 0) {
    list[index] = raffle;
  } else {
    list.push(raffle);
  }
  saveMockRaffles(list);
}

export function getMockNumbers(raffleId: string = INITIAL_RAFFLES[0].id): RaffleNumber[] {
  if (typeof window === 'undefined') return buildInitialNumbersForRaffle(raffleId);
  const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_NUMBERS_PREFIX}${raffleId}`);
  if (saved) return JSON.parse(saved);
  const initial = buildInitialNumbersForRaffle(raffleId);
  localStorage.setItem(`${LOCAL_STORAGE_KEY_NUMBERS_PREFIX}${raffleId}`, JSON.stringify(initial));
  return initial;
}

export function saveMockNumbers(numbers: RaffleNumber[], raffleId: string = INITIAL_RAFFLES[0].id): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_NUMBERS_PREFIX}${raffleId}`, JSON.stringify(numbers));
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

export function getActiveAdmin(): AdminProfile {
  if (typeof window === 'undefined') return INITIAL_ADMINS[0];
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACTIVE_ADMIN);
  return saved ? JSON.parse(saved) : INITIAL_ADMINS[0];
}

export function setActiveAdmin(admin: AdminProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVE_ADMIN, JSON.stringify(admin));
    window.dispatchEvent(new Event('active-admin-changed'));
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
