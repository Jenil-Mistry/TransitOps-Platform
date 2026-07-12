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

const mockDrivers: Driver[] = [
  { id: 'd1', name: 'Alex', licenseNumber: 'DL12345', licenseCategory: 'Class B', licenseExpiryDate: '2028-12-31', contactNumber: '555-0101', safetyScore: 95, status: 'Available' },
  { id: 'd2', name: 'Sarah', licenseNumber: 'DL98765', licenseCategory: 'Class A', licenseExpiryDate: '2025-10-15', contactNumber: '555-0202', safetyScore: 88, status: 'Available' },
  { id: 'd3', name: 'Mike', licenseNumber: 'DL55555', licenseCategory: 'Class A', licenseExpiryDate: '2024-01-01', contactNumber: '555-0303', safetyScore: 60, status: 'Available' },
];

export const useDriverStore = create<DriverState>((set, get) => ({
  drivers: mockDrivers,
  loading: false,

  fetchDrivers: async () => {
    set({ loading: true });
    try {
      const data = await driverApi.getAll();
      if (data && data.length > 0) {
        set({ drivers: data, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (err) {
      console.warn('⚠️ Could not fetch drivers from API (using fallback/current state):', err);
      set({ loading: false });
    }
  },

  addDriver: async (driverData) => {
    const tempId = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      drivers: [...state.drivers, { ...driverData, id: tempId }]
    }));
    try {
      const created = await driverApi.create(driverData);
      set((state) => ({
        drivers: state.drivers.map(d => d.id === tempId ? created : d)
      }));
    } catch (err) {
      console.error('Failed to create driver on backend API:', err);
      await get().fetchDrivers();
    }
  },

  updateDriver: async (id, updates) => {
    set((state) => ({
      drivers: state.drivers.map(d => d.id === id ? { ...d, ...updates } : d)
    }));
    try {
      await driverApi.update(id, updates);
    } catch (err) {
      console.error('Failed to update driver on backend API:', err);
      await get().fetchDrivers();
    }
  },

  updateDriverStatus: async (id, status) => {
    set((state) => ({
      drivers: state.drivers.map(d => d.id === id ? { ...d, status } : d)
    }));
    try {
      await driverApi.update(id, { status });
    } catch (err) {
      console.error('Failed to update driver status on backend API:', err);
      await get().fetchDrivers();
    }
  },

  deleteDriver: async (id) => {
    set((state) => ({
      drivers: state.drivers.filter(d => d.id !== id)
    }));
    try {
      await driverApi.delete(id);
    } catch (err) {
      console.error('Failed to delete driver on backend API:', err);
      await get().fetchDrivers();
    }
  },
}));
