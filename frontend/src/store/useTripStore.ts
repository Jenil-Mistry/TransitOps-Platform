import { create } from 'zustand';
import type { Trip, TripStatus } from '../types';
import { tripApi } from '../services/api';
import { useVehicleStore } from './useVehicleStore';
import { useDriverStore } from './useDriverStore';

interface TripState {
  trips: Trip[];
  loading: boolean;
  fetchTrips: () => Promise<void>;
  addTrip: (trip: Omit<Trip, 'id' | 'status' | 'createdAt' | 'completedAt'>) => Promise<void>;
  updateTripStatus: (id: string, status: TripStatus, data?: { finalOdometer?: number; fuelConsumed?: number }) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
}

const mockTrips: Trip[] = [
  { id: 't1', source: 'Warehouse A', destination: 'City Center', vehicleId: 'v2', driverId: 'd2', cargoWeight: 12000, plannedDistance: 150, status: 'Dispatched', createdAt: new Date().toISOString() },
];

export const useTripStore = create<TripState>((set, get) => ({
  trips: mockTrips,
  loading: false,

  fetchTrips: async () => {
    set({ loading: true });
    try {
      const data = await tripApi.getAll();
      if (data && data.length > 0) {
        set({ trips: data, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (err) {
      console.warn('⚠️ Could not fetch trips from API (using fallback/current state):', err);
      set({ loading: false });
    }
  },

  addTrip: async (tripData) => {
    const tempId = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      trips: [...state.trips, { ...tripData, id: tempId, status: 'Draft', createdAt: new Date().toISOString() }]
    }));
    try {
      const created = await tripApi.create(tripData);
      set((state) => ({
        trips: state.trips.map(t => t.id === tempId ? created : t)
      }));
    } catch (err) {
      console.error('Failed to create trip on backend API:', err);
      await get().fetchTrips();
    }
  },

  updateTripStatus: async (id, status, data) => {
    // Optimistic local update
    set((state) => ({
      trips: state.trips.map(t => t.id === id ? { ...t, status, ...data, completedAt: status === 'Completed' ? new Date().toISOString() : t.completedAt } : t)
    }));

    try {
      if (status === 'Dispatched') {
        await tripApi.dispatch(id);
      } else if (status === 'Completed') {
        // Automatically provide fallback metrics if not passed by UI
        const trip = get().trips.find(t => t.id === id);
        const actualDistance = trip?.plannedDistance || 100;
        const fuelConsumed = data?.fuelConsumed !== undefined ? data.fuelConsumed : Math.round(actualDistance / 8);
        await tripApi.complete(id, {
          actualDistance,
          fuelConsumed,
          finalOdometer: data?.finalOdometer,
        });
      } else if (status === 'Cancelled') {
        await tripApi.cancel(id);
      }

      // Re-sync trips, vehicles, and drivers from backend so lifecycle (AVAILABLE <-> ON_TRIP) is 100% accurate
      await get().fetchTrips();
      await useVehicleStore.getState().fetchVehicles();
      await useDriverStore.getState().fetchDrivers();
    } catch (err) {
      console.error('Failed to update trip status on backend API:', err);
      await get().fetchTrips();
    }
  },

  deleteTrip: async (id) => {
    set((state) => ({
      trips: state.trips.filter(t => t.id !== id)
    }));
  },
}));
