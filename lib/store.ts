import { create } from 'zustand';
import { Raffle, RaffleNumber, Settings, NumberStatus, AdminProfile, DrawHistory } from './types';

export const DEFAULT_SETTINGS: Settings = {
  alias: '',
  holder: '',
  whatsapp: '',
  instagram: '',
  facebook: '',
  logo: 'TEMTECH Sorteos',
  primary_color: '#00E5FF',
  auto_message: 'Hola. Reservé el número {number}. Nombre: {name}, Apellido: {lastname}, Teléfono: {phone}. Adjunto comprobante.',
  live_stream_url: ''
};

export const DEFAULT_RAFFLE: Raffle = {
  id: '',
  title: '',
  description: '',
  prize: '',
  image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
  price: 0,
  total_numbers: 100,
  draw_date: '',
  draw_time: '21:00',
  status: 'active',
  primary_color: '#00E5FF',
  slug: '',
  live_stream_url: '',
  created_at: ''
};

export const DEFAULT_ADMIN: AdminProfile = {
  id: '',
  email: '',
  full_name: 'Administrador',
  role: 'admin',
  subscription_plan: 'gratis',
  live_stream_url: '',
  created_at: ''
};

interface AppState {
  raffles: Raffle[];
  activeRaffle: Raffle;
  raffle: Raffle; // Backwards-compatible alias for activeRaffle
  numbers: RaffleNumber[];
  settings: Settings;
  activeAdmin: AdminProfile;
  drawHistory: DrawHistory[];
  selectedNumber: RaffleNumber | null;
  isReservationOpen: boolean;
  isQrModalOpen: boolean;
  filterStatus: 'all' | NumberStatus;
  searchQuery: string;
  isAdminLoggedIn: boolean;
  isLoading: boolean;

  // Actions
  setActiveRaffle: (raffle: Raffle) => void;
  setRaffle: (raffle: Raffle) => void;
  setRaffles: (raffles: Raffle[]) => void;
  setNumbers: (numbers: RaffleNumber[]) => void;
  setSelectedNumber: (num: RaffleNumber | null) => void;
  setReservationOpen: (open: boolean) => void;
  setQrModalOpen: (open: boolean) => void;
  setFilterStatus: (status: 'all' | NumberStatus) => void;
  setSearchQuery: (query: string) => void;
  setSettings: (settings: Settings) => void;
  setActiveAdminProfile: (admin: AdminProfile) => void;
  setAdminLoggedIn: (loggedIn: boolean) => void;
  setDrawHistory: (history: DrawHistory[]) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  raffles: [],
  activeRaffle: DEFAULT_RAFFLE,
  raffle: DEFAULT_RAFFLE,
  numbers: [],
  settings: DEFAULT_SETTINGS,
  activeAdmin: DEFAULT_ADMIN,
  drawHistory: [],
  selectedNumber: null,
  isReservationOpen: false,
  isQrModalOpen: false,
  filterStatus: 'all',
  searchQuery: '',
  isAdminLoggedIn: false,
  isLoading: true,

  setActiveRaffle: (raffle) => set({ activeRaffle: raffle, raffle }),
  setRaffle: (raffle) => set({ activeRaffle: raffle, raffle }),
  setRaffles: (raffles) => set({ 
    raffles, 
    activeRaffle: raffles.length > 0 ? raffles[0] : DEFAULT_RAFFLE,
    raffle: raffles.length > 0 ? raffles[0] : DEFAULT_RAFFLE 
  }),
  setNumbers: (numbers) => set({ numbers }),
  setSelectedNumber: (num) => set({ selectedNumber: num }),
  setReservationOpen: (open) => set({ isReservationOpen: open }),
  setQrModalOpen: (open) => set({ isQrModalOpen: open }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSettings: (settings) => set({ settings }),
  setActiveAdminProfile: (admin) => set({ activeAdmin: admin }),
  setAdminLoggedIn: (loggedIn) => set({ isAdminLoggedIn: loggedIn }),
  setDrawHistory: (history) => set({ drawHistory: history }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
