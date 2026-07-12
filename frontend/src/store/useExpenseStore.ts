import { create } from 'zustand';
import type { FuelLog } from '../types';
import { fuelApi } from '../services/api';

interface ExpenseState {
  fuelLogs: FuelLog[];
  loading: boolean;
  fetchFuelLogs: () => Promise<void>;
  addFuelLog: (log: Omit<FuelLog, 'id'>) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set, get) => ({
  fuelLogs: [],
  loading: false,

  fetchFuelLogs: async () => {
    set({ loading: true });
    try {
      const data = await fuelApi.getAll();
      set({ fuelLogs: data || [], loading: false });
    } catch (err) {
      console.warn('⚠️ Could not fetch fuel logs from API:', err);
      set({ loading: false });
    }
  },

  addFuelLog: async (logData) => {
    try {
      const created = await fuelApi.create(logData);
      set((state) => ({
        fuelLogs: [created, ...state.fuelLogs]
      }));
    } catch (err) {
      console.error('Failed to create fuel log on backend API:', err);
      await get().fetchFuelLogs();
      throw err;
    }
  },
}));
