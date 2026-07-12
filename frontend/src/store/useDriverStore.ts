import { create } from 'zustand';
import type { Driver, DriverStatus } from '../types';
import { driverApi } from '../services/api';

interface DriverState {
  drivers: Driver[];
  loading: boolean;
  fetchDrivers: () => Promise<void>;
  addDriver: (driver: Omit<Driver, 'id'>) => Promise<void>;
  updateDriver: (id: string, updates: Partial<Driver>) => Promise<void>;
  updateDriverStatus: (id: string, status: DriverStatus) => Promise<void>;
  deleteDriver: (id: string) => Promise<void>;
}

export const useDriverStore = create<DriverState>((set, get) => ({
  drivers: [],
  loading: false,

  fetchDrivers: async () => {
    set({ loading: true });
    try {
      const data = await driverApi.getAll();
      set({ drivers: data || [], loading: false });
    } catch (err) {
      console.warn('⚠️ Could not fetch drivers from API:', err);
      set({ loading: false });
    }
  },

  addDriver: async (driverData) => {
    try {
      const created = await driverApi.create(driverData);
      set((state) => ({
        drivers: [created, ...state.drivers]
      }));
    } catch (err) {
      console.error('Failed to create driver on backend API:', err);
      throw err;
    }
  },

  updateDriver: async (id, updates) => {
    try {
      const updated = await driverApi.update(id, updates);
      set((state) => ({
        drivers: state.drivers.map(d => d.id === id ? updated : d)
      }));
    } catch (err) {
      console.error('Failed to update driver on backend API:', err);
      await get().fetchDrivers();
      throw err;
    }
  },

  updateDriverStatus: async (id, status) => {
    try {
      await driverApi.update(id, { status });
      set((state) => ({
        drivers: state.drivers.map(d => d.id === id ? { ...d, status } : d)
      }));
    } catch (err) {
      console.error('Failed to update driver status on backend API:', err);
      await get().fetchDrivers();
      throw err;
    }
  },

  deleteDriver: async (id) => {
    try {
      await driverApi.delete(id);
      set((state) => ({
        drivers: state.drivers.filter(d => d.id !== id)
      }));
    } catch (err) {
      console.error('Failed to delete driver on backend API:', err);
      await get().fetchDrivers();
      throw err;
    }
  },
}));
