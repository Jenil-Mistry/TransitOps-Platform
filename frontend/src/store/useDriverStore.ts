import { create } from 'zustand';
import type { Driver, DriverStatus } from '../types';

interface DriverState {
  drivers: Driver[];
  addDriver: (driver: Omit<Driver, 'id'>) => void;
  updateDriver: (id: string, updates: Partial<Driver>) => void;
  updateDriverStatus: (id: string, status: DriverStatus) => void;
  deleteDriver: (id: string) => void;
}

const mockDrivers: Driver[] = [
  { id: 'd1', name: 'Alex', licenseNumber: 'DL12345', licenseCategory: 'Class B', licenseExpiryDate: '2028-12-31', contactNumber: '555-0101', safetyScore: 95, status: 'Available' },
  { id: 'd2', name: 'Sarah', licenseNumber: 'DL98765', licenseCategory: 'Class A', licenseExpiryDate: '2025-10-15', contactNumber: '555-0202', safetyScore: 88, status: 'On Trip' },
  { id: 'd3', name: 'Mike', licenseNumber: 'DL55555', licenseCategory: 'Class A', licenseExpiryDate: '2024-01-01', contactNumber: '555-0303', safetyScore: 60, status: 'Suspended' },
];

export const useDriverStore = create<DriverState>((set) => ({
  drivers: mockDrivers,
  addDriver: (driverData) => set((state) => ({
    drivers: [...state.drivers, { ...driverData, id: Math.random().toString(36).substr(2, 9) }]
  })),
  updateDriver: (id, updates) => set((state) => ({
    drivers: state.drivers.map(d => d.id === id ? { ...d, ...updates } : d)
  })),
  updateDriverStatus: (id, status) => set((state) => ({
    drivers: state.drivers.map(d => d.id === id ? { ...d, status } : d)
  })),
  deleteDriver: (id) => set((state) => ({
    drivers: state.drivers.filter(d => d.id !== id)
  })),
}));
