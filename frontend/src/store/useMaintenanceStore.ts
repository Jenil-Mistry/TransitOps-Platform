import { create } from 'zustand';
import type { MaintenanceLog } from '../types';
import { maintenanceApi } from '../services/api';
import { useVehicleStore } from './useVehicleStore';

interface MaintenanceState {
  logs: MaintenanceLog[];
  loading: boolean;
  fetchLogs: () => Promise<void>;
  addLog: (log: Omit<MaintenanceLog, 'id'>) => Promise<void>;
  updateLogStatus: (id: string, status: 'Open' | 'Closed') => Promise<void>;
}

export const useMaintenanceStore = create<MaintenanceState>((set, get) => ({
  logs: [],
  loading: false,

  fetchLogs: async () => {
    set({ loading: true });
    try {
      const data = await maintenanceApi.getAll();
      set({ logs: data || [], loading: false });
    } catch (err) {
      console.warn('⚠️ Could not fetch maintenance logs from API:', err);
      set({ loading: false });
    }
  },

  addLog: async (logData) => {
    try {
      const created = await maintenanceApi.create(logData);
      set((state) => ({
        logs: [created, ...state.logs]
      }));
      // Re-sync vehicle status (backend switches vehicle to IN_SHOP when maintenance is logged)
      await useVehicleStore.getState().fetchVehicles();
    } catch (err) {
      console.error('Failed to create maintenance log on backend API:', err);
      await get().fetchLogs();
      throw err;
    }
  },

  updateLogStatus: async (id, status) => {
    try {
      if (status === 'Closed') {
        // Find log to get vehicleId before updating
        const targetLog = get().logs.find(m => m.id === id);
        
        // Optimistic update locally first so UI responds instantly
        set((state) => ({
          logs: state.logs.map(m => m.id === id ? { ...m, status: 'Closed' } : m)
        }));
        if (targetLog) {
          useVehicleStore.setState((vState) => ({
            vehicles: vState.vehicles.map(v => v.id === targetLog.vehicleId ? { ...v, status: 'Available' } : v)
          }));
        }

        const completed = await maintenanceApi.complete(id);
        set((state) => ({
          logs: state.logs.map(m => m.id === id ? completed : m)
        }));
        // Re-sync vehicle status with backend
        await useVehicleStore.getState().fetchVehicles();
      } else {
        set((state) => ({
          logs: state.logs.map(m => m.id === id ? { ...m, status } : m)
        }));
      }
    } catch (err) {
      console.error('Failed to update maintenance status on backend API:', err);
      await get().fetchLogs();
      await useVehicleStore.getState().fetchVehicles();
      throw err;
    }
  },
}));
