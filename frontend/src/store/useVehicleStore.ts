import { create } from 'zustand';
import type { Vehicle, VehicleStatus } from '../types';

interface VehicleState {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  updateVehicleStatus: (id: string, status: VehicleStatus) => void;
  deleteVehicle: (id: string) => void;
}

const mockVehicles: Vehicle[] = [
  { id: 'v1', registrationNumber: 'VAN-05', name: 'Ford Transit', type: 'Van', maxLoadCapacity: 500, odometer: 15000, acquisitionCost: 35000, status: 'Available' },
  { id: 'v2', registrationNumber: 'TRK-10', name: 'Volvo FH', type: 'Truck', maxLoadCapacity: 15000, odometer: 45000, acquisitionCost: 120000, status: 'On Trip' },
  { id: 'v3', registrationNumber: 'TRK-11', name: 'Scania R', type: 'Truck', maxLoadCapacity: 20000, odometer: 80000, acquisitionCost: 140000, status: 'In Shop' },
];

export const useVehicleStore = create<VehicleState>((set) => ({
  vehicles: mockVehicles,
  addVehicle: (vehicleData) => set((state) => ({
    vehicles: [...state.vehicles, { ...vehicleData, id: Math.random().toString(36).substr(2, 9) }]
  })),
  updateVehicle: (id, updates) => set((state) => ({
    vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...updates } : v)
  })),
  updateVehicleStatus: (id, status) => set((state) => ({
    vehicles: state.vehicles.map(v => v.id === id ? { ...v, status } : v)
  })),
  deleteVehicle: (id) => set((state) => ({
    vehicles: state.vehicles.filter(v => v.id !== id)
  })),
}));
