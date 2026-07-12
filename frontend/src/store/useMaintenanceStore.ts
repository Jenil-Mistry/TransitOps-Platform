import { create } from 'zustand';
import type { MaintenanceLog } from '../types';

interface MaintenanceState {
  logs: MaintenanceLog[];
  addLog: (log: Omit<MaintenanceLog, 'id'>) => void;
  updateLogStatus: (id: string, status: 'Open' | 'Closed') => void;
}

const mockLogs: MaintenanceLog[] = [
  { id: 'm1', vehicleId: 'v3', date: new Date().toISOString(), description: 'Engine overhaul', cost: 1500, status: 'Open' },
];

export const useMaintenanceStore = create<MaintenanceState>((set) => ({
  logs: mockLogs,
  addLog: (logData) => set((state) => ({
    logs: [...state.logs, { ...logData, id: Math.random().toString(36).substr(2, 9) }]
  })),
  updateLogStatus: (id, status) => set((state) => ({
    logs: state.logs.map(m => m.id === id ? { ...m, status } : m)
  })),
}));
