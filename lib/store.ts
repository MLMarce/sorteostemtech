import { create } from 'zustand';
import { Raffle, RaffleNumber, Settings, NumberStatus } from './types';
import { 
  getMockRaffle, 
  getMockNumbers, 
  getMockSettings, 
  saveMockNumbers, 
  saveMockRaffle,
  saveMockSettings
} from './supabaseClient';

interface AppState {
  raffle: Raffle;
  numbers: RaffleNumber[];
  settings: Settings;
  selectedNumber: RaffleNumber | null;
  isReservationOpen: boolean;
  isQrModalOpen: boolean;
  filterStatus: 'all' | NumberStatus;
  searchQuery: string;
  isAdminLoggedIn: boolean;

  // Actions
  setRaffle: (raffle: Raffle) => void;
  setNumbers: (numbers: RaffleNumber[]) => void;
  updateNumberStatus: (
    num: number, 
    status: NumberStatus, 
    userData?: { name: string; lastname: string; phone: string }
  ) => boolean;
  setSelectedNumber: (num: RaffleNumber | null) => void;
  setReservationOpen: (open: boolean) => void;
  setQrModalOpen: (open: boolean) => void;
  setFilterStatus: (status: 'all' | NumberStatus) => void;
  setSearchQuery: (query: string) => void;
  setSettings: (settings: Settings) => void;
  setAdminLoggedIn: (loggedIn: boolean) => void;
  refreshFromStorage: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  raffle: getMockRaffle(),
  numbers: getMockNumbers(),
  settings: getMockSettings(),
  selectedNumber: null,
  isReservationOpen: false,
  isQrModalOpen: false,
  filterStatus: 'all',
  searchQuery: '',
  isAdminLoggedIn: true, // Default to true for easy admin testing

  setRaffle: (raffle) => {
    saveMockRaffle(raffle);
    set({ raffle });
  },

  setNumbers: (numbers) => {
    saveMockNumbers(numbers);
    set({ numbers });
  },

  updateNumberStatus: (num, status, userData) => {
    const currentNumbers = get().numbers;
    const target = currentNumbers.find(n => n.number === num);
    
    if (!target) return false;

    // Concurrency check: If trying to reserve but it's no longer available
    if (status === 'reserved' && target.status !== 'available') {
      return false; // Failed because someone else reserved or bought it!
    }

    const updated = currentNumbers.map(n => {
      if (n.number === num) {
        return {
          ...n,
          status,
          user_name: userData ? userData.name : n.user_name,
          user_lastname: userData ? userData.lastname : n.user_lastname,
          phone: userData ? userData.phone : n.phone,
          reserved_at: status === 'reserved' ? new Date().toISOString() : n.reserved_at,
          paid_at: status === 'paid' ? new Date().toISOString() : n.paid_at,
        };
      }
      return n;
    });

    saveMockNumbers(updated);
    set({ numbers: updated });
    return true;
  },

  setSelectedNumber: (num) => set({ selectedNumber: num }),
  setReservationOpen: (open) => set({ isReservationOpen: open }),
  setQrModalOpen: (open) => set({ isQrModalOpen: open }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSettings: (settings) => {
    saveMockSettings(settings);
    set({ settings });
  },
  setAdminLoggedIn: (loggedIn) => set({ isAdminLoggedIn: loggedIn }),
  refreshFromStorage: () => {
    set({
      raffle: getMockRaffle(),
      numbers: getMockNumbers(),
      settings: getMockSettings(),
    });
  }
}));
