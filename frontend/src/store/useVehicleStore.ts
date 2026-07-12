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

const mockVehicles: Vehicle[] = [
  { id: 'v1', registrationNumber: 'VAN-05', name: 'Ford Transit', type: 'Van', maxLoadCapacity: 500, odometer: 15000, acquisitionCost: 35000, status: 'Available' },
  { id: 'v2', registrationNumber: 'TRK-10', name: 'Volvo FH', type: 'Truck', maxLoadCapacity: 15000, odometer: 45000, acquisitionCost: 120000, status: 'Available' },
  { id: 'v3', registrationNumber: 'TRK-11', name: 'Scania R', type: 'Truck', maxLoadCapacity: 20000, odometer: 80000, acquisitionCost: 140000, status: 'Available' },
];

export const useVehicleStore = create<VehicleState>((set, get) => ({
  vehicles: mockVehicles,
  loading: false,

  fetchVehicles: async () => {
    set({ loading: true });
    try {
      const data = await vehicleApi.getAll();
      if (data && data.length > 0) {
        set({ vehicles: data, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (err) {
      console.warn('⚠️ Could not fetch vehicles from API (using fallback/current state):', err);
      set({ loading: false });
    }
  },

  addVehicle: async (vehicleData) => {
    // Optimistic local update
    const tempId = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      vehicles: [...state.vehicles, { ...vehicleData, id: tempId }]
    }));
    try {
      const created = await vehicleApi.create(vehicleData);
      set((state) => ({
        vehicles: state.vehicles.map(v => v.id === tempId ? created : v)
      }));
    } catch (err) {
      console.error('Failed to create vehicle on backend API:', err);
      await get().fetchVehicles();
    }
  },

  updateVehicle: async (id, updates) => {
    set((state) => ({
      vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...updates } : v)
    }));
    try {
      await vehicleApi.update(id, updates);
    } catch (err) {
      console.error('Failed to update vehicle on backend API:', err);
      await get().fetchVehicles();
    }
  },

  updateVehicleStatus: async (id, status) => {
    set((state) => ({
      vehicles: state.vehicles.map(v => v.id === id ? { ...v, status } : v)
    }));
    try {
      await vehicleApi.update(id, { status });
    } catch (err) {
      console.error('Failed to update vehicle status on backend API:', err);
      await get().fetchVehicles();
    }
  },

  deleteVehicle: async (id) => {
    set((state) => ({
      vehicles: state.vehicles.filter(v => v.id !== id)
    }));
    try {
      await vehicleApi.delete(id);
    } catch (err) {
      console.error('Failed to delete vehicle on backend API:', err);
      await get().fetchVehicles();
    }
  },
}));
