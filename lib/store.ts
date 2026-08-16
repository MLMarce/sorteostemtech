import { create } from 'zustand';
import { Raffle, RaffleNumber, Settings, NumberStatus, AdminProfile } from './types';
import { 
  getMockRaffles,
  getMockNumbers, 
  getMockSettings, 
  saveMockNumbers, 
  saveMockRaffle,
  saveMockSettings,
  saveMockRaffles,
  getActiveAdmin,
  setActiveAdmin as setStoredActiveAdmin,
  INITIAL_ADMINS
} from './supabaseClient';

interface AppState {
  raffles: Raffle[];
  activeRaffle: Raffle;
  raffle: Raffle; // Backwards compatible alias for activeRaffle
  numbers: RaffleNumber[];
  settings: Settings;
  activeAdmin: AdminProfile;
  selectedNumber: RaffleNumber | null;
  isReservationOpen: boolean;
  isQrModalOpen: boolean;
  filterStatus: 'all' | NumberStatus;
  searchQuery: string;
  isAdminLoggedIn: boolean;

  // Actions
  setActiveRaffle: (raffle: Raffle) => void;
  setRaffle: (raffle: Raffle) => void;
  setRaffles: (raffles: Raffle[]) => void;
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
  setActiveAdminProfile: (admin: AdminProfile) => void;
  setAdminLoggedIn: (loggedIn: boolean) => void;
  refreshFromStorage: () => void;
}

export const useAppStore = create<AppState>((set, get) => {
  const initialRaffles = getMockRaffles();
  const initialActive = initialRaffles[0];
  const initialAdmin = getActiveAdmin();

  return {
    raffles: initialRaffles,
    activeRaffle: initialActive,
    raffle: initialActive,
    numbers: getMockNumbers(initialActive.id),
    settings: getMockSettings(),
    activeAdmin: initialAdmin,
    selectedNumber: null,
    isReservationOpen: false,
    isQrModalOpen: false,
    filterStatus: 'all',
    searchQuery: '',
    isAdminLoggedIn: true, // Default to true for easy admin testing

    setActiveRaffle: (raffle) => {
      const numbers = getMockNumbers(raffle.id);
      saveMockRaffle(raffle);
      set({ activeRaffle: raffle, raffle, numbers });
    },

    setRaffle: (raffle) => {
      const numbers = getMockNumbers(raffle.id);
      saveMockRaffle(raffle);
      set({ activeRaffle: raffle, raffle, numbers });
    },

    setRaffles: (raffles) => {
      saveMockRaffles(raffles);
      set({ raffles });
    },

    setNumbers: (numbers) => {
      const activeId = get().activeRaffle.id;
      saveMockNumbers(numbers, activeId);
      set({ numbers });
    },

    updateNumberStatus: (num, status, userData) => {
      const currentNumbers = get().numbers;
      const activeRaffleId = get().activeRaffle.id;
      const target = currentNumbers.find(n => n.number === num);
      
      if (!target) return false;

      // Concurrency check: If trying to reserve but it's no longer available
      if (status === 'reserved' && target.status !== 'available') {
        return false;
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

      saveMockNumbers(updated, activeRaffleId);
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
    setActiveAdminProfile: (admin) => {
      setStoredActiveAdmin(admin);
      set({ activeAdmin: admin });
    },
    setAdminLoggedIn: (loggedIn) => set({ isAdminLoggedIn: loggedIn }),
    refreshFromStorage: () => {
      const raffles = getMockRaffles();
      const currentActiveId = get().activeRaffle.id;
      const active = raffles.find(r => r.id === currentActiveId) || raffles[0];
      set({
        raffles,
        activeRaffle: active,
        raffle: active,
        numbers: getMockNumbers(active.id),
        settings: getMockSettings(),
        activeAdmin: getActiveAdmin()
      });
    }
  };
});
