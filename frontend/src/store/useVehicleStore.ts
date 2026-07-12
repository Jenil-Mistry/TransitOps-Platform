import { create } from 'zustand';
import type { Vehicle, VehicleStatus } from '../types';
import { vehicleApi } from '../services/api';

interface VehicleState {
  vehicles: Vehicle[];
  loading: boolean;
  fetchVehicles: () => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  updateVehicleStatus: (id: string, status: VehicleStatus) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
}

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: [],
  loading: false,

  fetchVehicles: async () => {
    set({ loading: true });
    try {
      const data = await vehicleApi.getAll();
      set({ vehicles: data || [], loading: false });
    } catch (err) {
      console.warn('⚠️ Could not fetch vehicles from API:', err);
      set({ loading: false });
    }
  },

  addVehicle: async (vehicleData) => {
    try {
      const created = await vehicleApi.create(vehicleData);
      set((state) => ({
        vehicles: [created, ...state.vehicles]
      }));
    } catch (err) {
      console.error('Failed to create vehicle on backend API:', err);
      throw err;
    }
  },

  updateVehicle: async (id, updates) => {
    try {
      const updated = await vehicleApi.update(id, updates);
      set((state) => ({
        vehicles: state.vehicles.map(v => v.id === id ? updated : v)
      }));
    } catch (err) {
      console.error('Failed to update vehicle on backend API:', err);
      await get().fetchVehicles();
      throw err;
    }
  },

  updateVehicleStatus: async (id, status) => {
    try {
      await vehicleApi.update(id, { status });
      set((state) => ({
        vehicles: state.vehicles.map(v => v.id === id ? { ...v, status } : v)
      }));
    } catch (err) {
      console.error('Failed to update vehicle status on backend API:', err);
      await get().fetchVehicles();
      throw err;
    }
  },

  deleteVehicle: async (id) => {
    try {
      await vehicleApi.delete(id);
      set((state) => ({
        vehicles: state.vehicles.filter(v => v.id !== id)
      }));
    } catch (err) {
      console.error('Failed to delete vehicle on backend API:', err);
      await get().fetchVehicles();
      throw err;
    }
  },
}));
