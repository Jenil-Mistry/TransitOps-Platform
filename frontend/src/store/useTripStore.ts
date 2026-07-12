import { create } from 'zustand';
import type { Trip, TripStatus } from '../types';

interface TripState {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'status' | 'createdAt'>) => void;
  updateTripStatus: (id: string, status: TripStatus, data?: { finalOdometer?: number; fuelConsumed?: number }) => void;
  deleteTrip: (id: string) => void;
}

const mockTrips: Trip[] = [
  { id: 't1', source: 'Warehouse A', destination: 'City Center', vehicleId: 'v2', driverId: 'd2', cargoWeight: 12000, plannedDistance: 150, status: 'Dispatched', createdAt: new Date().toISOString() },
];

export const useTripStore = create<TripState>((set) => ({
  trips: mockTrips,
  addTrip: (tripData) => set((state) => ({
    trips: [...state.trips, { ...tripData, id: Math.random().toString(36).substr(2, 9), status: 'Draft', createdAt: new Date().toISOString() }]
  })),
  updateTripStatus: (id, status, data) => set((state) => ({
    trips: state.trips.map(t => t.id === id ? { ...t, status, ...data, completedAt: status === 'Completed' ? new Date().toISOString() : t.completedAt } : t)
  })),
  deleteTrip: (id) => set((state) => ({
    trips: state.trips.filter(t => t.id !== id)
  })),
}));
