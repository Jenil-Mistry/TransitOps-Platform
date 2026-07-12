import { create } from 'zustand';
import type { FuelLog } from '../types';

interface ExpenseState {
  fuelLogs: FuelLog[];
  addFuelLog: (log: Omit<FuelLog, 'id'>) => void;
}

const mockFuelLogs: FuelLog[] = [
  { id: 'f1', vehicleId: 'v1', liters: 50, cost: 85.5, date: new Date().toISOString() },
];

export const useExpenseStore = create<ExpenseState>((set) => ({
  fuelLogs: mockFuelLogs,
  addFuelLog: (logData) => set((state) => ({
    fuelLogs: [...state.fuelLogs, { ...logData, id: Math.random().toString(36).substr(2, 9) }]
  })),
}));
