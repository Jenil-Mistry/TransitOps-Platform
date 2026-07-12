import axios from 'axios';
import type { Vehicle, Driver, Trip, VehicleStatus, DriverStatus, TripStatus } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auto-Login helper to ensure a valid JWT token is always present for Neon DB requests
let authPromise: Promise<string | null> | null = null;

export const ensureToken = async (): Promise<string | null> => {
  let token = localStorage.getItem('transitops_token') || localStorage.getItem('token');
  if (token) return token;

  if (!authPromise) {
    authPromise = (async () => {
      try {
        // Log in with our seeded Fleet Manager account (`manager@transitops.com` / `password123`)
        const res = await axios.post(`${API_BASE_URL}/auth/login`, {
          email: 'manager@transitops.com',
          password: 'password123',
        });
        const newToken = res.data?.data?.token;
        if (newToken) {
          localStorage.setItem('transitops_token', newToken);
          return newToken;
        }
      } catch (err) {
        console.warn('⚠️ Could not auto-authenticate with backend:', err);
      }
      return null;
    })();
  }
  return authPromise;
};

// Attach JWT Token to every request automatically
api.interceptors.request.use(async (config) => {
  const token = await ensureToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Helper: Map Backend UPPERCASE Enums -> Frontend UI Title Case
export const toFrontendStatus = (status?: string): any => {
  if (!status) return 'Available';
  const map: Record<string, string> = {
    'AVAILABLE': 'Available',
    'ON_TRIP': 'On Trip',
    'IN_SHOP': 'In Shop',
    'RETIRED': 'Retired',
    'OFF_DUTY': 'Off Duty',
    'SUSPENDED': 'Suspended',
    'DRAFT': 'Draft',
    'DISPATCHED': 'Dispatched',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled',
    'ACTIVE': 'Open',
    'FLEET_MANAGER': 'Fleet Manager',
    'DISPATCHER': 'Driver',
    'SAFETY_OFFICER': 'Safety Officer',
    'FINANCIAL_ANALYST': 'Financial Analyst',
  };
  return map[status] || status;
};

// Helper: Map Frontend UI Title Case -> Backend UPPERCASE Enums
export const toBackendStatus = (status?: string): any => {
  if (!status) return 'AVAILABLE';
  const map: Record<string, string> = {
    'Available': 'AVAILABLE',
    'On Trip': 'ON_TRIP',
    'In Shop': 'IN_SHOP',
    'Retired': 'RETIRED',
    'Off Duty': 'OFF_DUTY',
    'Suspended': 'SUSPENDED',
    'Draft': 'DRAFT',
    'Dispatched': 'DISPATCHED',
    'Completed': 'COMPLETED',
    'Cancelled': 'CANCELLED',
    'Open': 'ACTIVE',
    'Closed': 'COMPLETED',
    'Fleet Manager': 'FLEET_MANAGER',
    'Driver': 'DISPATCHER',
    'Safety Officer': 'SAFETY_OFFICER',
    'Financial Analyst': 'FINANCIAL_ANALYST',
  };
  return map[status] || status;
};

export const mapVehicleFromBackend = (v: any): Vehicle => ({
  id: v.id,
  registrationNumber: v.registrationNumber,
  name: v.name,
  type: v.type,
  maxLoadCapacity: v.maxLoadCapacity,
  odometer: v.odometer,
  acquisitionCost: v.acquisitionCost,
  status: toFrontendStatus(v.status) as VehicleStatus,
});

export const mapDriverFromBackend = (d: any): Driver => ({
  id: d.id,
  name: d.name,
  licenseNumber: d.licenseNumber,
  licenseCategory: d.licenseCategory,
  licenseExpiryDate: d.licenseExpiry ? new Date(d.licenseExpiry).toISOString().split('T')[0] : '2027-12-31',
  contactNumber: d.contactNumber,
  safetyScore: d.safetyScore || 100,
  status: toFrontendStatus(d.status) as DriverStatus,
});

export const mapTripFromBackend = (t: any): Trip => ({
  id: t.id,
  source: t.source,
  destination: t.destination,
  vehicleId: t.vehicleId,
  driverId: t.driverId,
  cargoWeight: t.cargoWeight,
  plannedDistance: t.plannedDistance,
  status: toFrontendStatus(t.status) as TripStatus,
  finalOdometer: t.actualDistance ? t.plannedDistance + (t.actualDistance - t.plannedDistance) : undefined,
  fuelConsumed: t.fuelConsumed,
  createdAt: t.createdAt || new Date().toISOString(),
  completedAt: t.completedAt,
});

// ─── Vehicle API Calls ───────────────────────────────────
export const vehicleApi = {
  getAll: async (): Promise<Vehicle[]> => {
    const res = await api.get('/vehicles?limit=100');
    return (res.data?.data?.vehicles || []).map(mapVehicleFromBackend);
  },
  create: async (data: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
    const res = await api.post('/vehicles', {
      ...data,
      status: toBackendStatus(data.status),
    });
    return mapVehicleFromBackend(res.data.data.vehicle);
  },
  update: async (id: string, updates: Partial<Vehicle>): Promise<Vehicle> => {
    const payload: any = { ...updates };
    if (updates.status) payload.status = toBackendStatus(updates.status);
    const res = await api.put(`/vehicles/${id}`, payload);
    return mapVehicleFromBackend(res.data.data.vehicle);
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  },
};

// ─── Driver API Calls ────────────────────────────────────
export const driverApi = {
  getAll: async (): Promise<Driver[]> => {
    const res = await api.get('/drivers?limit=100');
    return (res.data?.data?.drivers || []).map(mapDriverFromBackend);
  },
  create: async (data: Omit<Driver, 'id'>): Promise<Driver> => {
    const res = await api.post('/drivers', {
      name: data.name,
      licenseNumber: data.licenseNumber,
      licenseCategory: data.licenseCategory,
      licenseExpiry: data.licenseExpiryDate,
      contactNumber: data.contactNumber,
      safetyScore: data.safetyScore,
      status: toBackendStatus(data.status),
    });
    return mapDriverFromBackend(res.data.data.driver);
  },
  update: async (id: string, updates: Partial<Driver>): Promise<Driver> => {
    const payload: any = { ...updates };
    if (updates.status) payload.status = toBackendStatus(updates.status);
    if (updates.licenseExpiryDate) payload.licenseExpiry = updates.licenseExpiryDate;
    const res = await api.put(`/drivers/${id}`, payload);
    return mapDriverFromBackend(res.data.data.driver);
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/drivers/${id}`);
  },
};

// ─── Trip API Calls ──────────────────────────────────────
export const tripApi = {
  getAll: async (): Promise<Trip[]> => {
    const res = await api.get('/trips?limit=100');
    return (res.data?.data?.trips || []).map(mapTripFromBackend);
  },
  create: async (data: Omit<Trip, 'id' | 'status' | 'createdAt' | 'completedAt'>): Promise<Trip> => {
    const res = await api.post('/trips', {
      source: data.source,
      destination: data.destination,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      cargoWeight: data.cargoWeight,
      plannedDistance: data.plannedDistance,
    });
    return mapTripFromBackend(res.data.data.trip);
  },
  dispatch: async (id: string): Promise<Trip> => {
    const res = await api.patch(`/trips/${id}/dispatch`);
    return mapTripFromBackend(res.data.data.trip);
  },
  complete: async (id: string, completionData: { actualDistance: number; fuelConsumed: number; finalOdometer?: number }): Promise<Trip> => {
    const res = await api.patch(`/trips/${id}/complete`, completionData);
    return mapTripFromBackend(res.data.data.trip);
  },
  cancel: async (id: string): Promise<Trip> => {
    const res = await api.patch(`/trips/${id}/cancel`);
    return mapTripFromBackend(res.data.data.trip);
  },
};

// ─── Reports / Analytics API Calls ───────────────────────
export const reportApi = {
  getDashboard: async () => {
    const res = await api.get('/reports/dashboard');
    return res.data?.data?.overview;
  },
  getFuelEfficiency: async () => {
    const res = await api.get('/reports/fuel-efficiency');
    return res.data?.data?.fuelEfficiency;
  },
  getCostAnalysis: async () => {
    const res = await api.get('/reports/cost-analysis');
    return res.data?.data?.costAnalysis;
  },
};
