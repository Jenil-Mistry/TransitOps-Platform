export type Role = 'Fleet Manager' | 'Driver' | 'Safety Officer' | 'Financial Analyst';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Retired';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  name: string;
  type: string;
  maxLoadCapacity: number; // in kg
  odometer: number;
  acquisitionCost: number;
  status: VehicleStatus;
}

export type DriverStatus = 'Available' | 'On Trip' | 'Off Duty' | 'Suspended';

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: string; // YYYY-MM-DD
  contactNumber: string;
  safetyScore: number; // 0 - 100
  status: DriverStatus;
}

export type TripStatus = 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled';

export interface Trip {
  id: string;
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeight: number; // in kg
  plannedDistance: number; // in km
  status: TripStatus;
  finalOdometer?: number;
  fuelConsumed?: number; // in liters
  createdAt: string;
  completedAt?: string;
}

export interface MaintenanceLog {
  id: string;
  vehicleId: string;
  date: string;
  description: string;
  cost: number;
  status: 'Open' | 'Closed';
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  tripId?: string;
  liters: number;
  cost: number;
  date: string;
}
