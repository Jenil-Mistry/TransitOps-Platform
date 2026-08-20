// ─── Comprehensive Realistic Mock Data for TransitOps ───
// Used when backend data is empty or as dashboard fallback data

export const mockVehicles = [
  { id: 'v1', name: 'MH-204', registrationNumber: 'GJ 01 AB 4821', type: 'Truck', status: 'On Trip' as const, maxLoadCapacity: 12000, odometer: 84231, acquisitionCost: 1850000, region: 'Gujarat', location: 'Ahmedabad', driver: 'Rahul Patel', fuelEfficiency: 8.4, nextService: '2026-09-12' },
  { id: 'v2', name: 'MH-203', registrationNumber: 'GJ 01 CD 5612', type: 'Truck', status: 'In Shop' as const, maxLoadCapacity: 10000, odometer: 92450, acquisitionCost: 1650000, region: 'Gujarat', location: 'Vadodara', driver: null, fuelEfficiency: 7.8, nextService: '2026-08-25' },
  { id: 'v3', name: 'MH-102', registrationNumber: 'MH 12 EF 3490', type: 'Heavy Truck', status: 'Available' as const, maxLoadCapacity: 18000, odometer: 156320, acquisitionCost: 2800000, region: 'Maharashtra', location: 'Mumbai', driver: 'Amit Singh', fuelEfficiency: 6.2, nextService: '2026-09-01' },
  { id: 'v4', name: 'MH-305', registrationNumber: 'GJ 05 GH 7823', type: 'Mini Truck', status: 'On Trip' as const, maxLoadCapacity: 5000, odometer: 45620, acquisitionCost: 890000, region: 'Gujarat', location: 'Surat', driver: 'Priya Sharma', fuelEfficiency: 12.1, nextService: '2026-10-05' },
  { id: 'v5', name: 'MH-410', registrationNumber: 'GJ 03 IJ 1245', type: 'Truck', status: 'Available' as const, maxLoadCapacity: 14000, odometer: 67890, acquisitionCost: 1920000, region: 'Gujarat', location: 'Rajkot', driver: null, fuelEfficiency: 8.9, nextService: '2026-09-18' },
  { id: 'v6', name: 'MH-506', registrationNumber: 'MH 04 KL 6789', type: 'Container', status: 'On Trip' as const, maxLoadCapacity: 20000, odometer: 128450, acquisitionCost: 3200000, region: 'Maharashtra', location: 'Pune', driver: 'Vikram Reddy', fuelEfficiency: 5.8, nextService: '2026-08-30' },
  { id: 'v7', name: 'MH-118', registrationNumber: 'GJ 06 MN 9012', type: 'Truck', status: 'Available' as const, maxLoadCapacity: 11000, odometer: 73210, acquisitionCost: 1750000, region: 'Gujarat', location: 'Ahmedabad', driver: null, fuelEfficiency: 8.6, nextService: '2026-09-22' },
  { id: 'v8', name: 'MH-220', registrationNumber: 'GJ 02 OP 3456', type: 'Mini Truck', status: 'Available' as const, maxLoadCapacity: 4500, odometer: 38920, acquisitionCost: 820000, region: 'Gujarat', location: 'Surat', driver: null, fuelEfficiency: 13.2, nextService: '2026-10-15' },
];

export const mockDrivers = [
  { id: 'd1', name: 'Rahul Patel', licenseNumber: 'DRV-102', licenseCategory: 'HMV', status: 'On Trip' as const, contactNumber: '+91 98765 43210', safetyScore: 94, licenseExpiryDate: '2027-03-15', trips: 124, completionRate: 96.8, totalDistance: 42850, vehicle: 'MH-204', lastActive: '2 min ago' },
  { id: 'd2', name: 'Priya Sharma', licenseNumber: 'DRV-108', licenseCategory: 'LMV', status: 'On Trip' as const, contactNumber: '+91 87654 32109', safetyScore: 97, licenseExpiryDate: '2027-06-22', trips: 98, completionRate: 98.2, totalDistance: 31240, vehicle: 'MH-305', lastActive: '5 min ago' },
  { id: 'd3', name: 'Amit Singh', licenseNumber: 'DRV-115', licenseCategory: 'HMV', status: 'Available' as const, contactNumber: '+91 76543 21098', safetyScore: 88, licenseExpiryDate: '2026-12-10', trips: 156, completionRate: 94.5, totalDistance: 58920, vehicle: 'MH-102', lastActive: '1 hour ago' },
  { id: 'd4', name: 'Vikram Reddy', licenseNumber: 'DRV-121', licenseCategory: 'HMV', status: 'On Trip' as const, contactNumber: '+91 65432 10987', safetyScore: 91, licenseExpiryDate: '2027-01-08', trips: 143, completionRate: 95.8, totalDistance: 52340, vehicle: 'MH-506', lastActive: '8 min ago' },
  { id: 'd5', name: 'Neha Gupta', licenseNumber: 'DRV-134', licenseCategory: 'LMV', status: 'Available' as const, contactNumber: '+91 54321 09876', safetyScore: 96, licenseExpiryDate: '2027-09-30', trips: 87, completionRate: 97.5, totalDistance: 28670, vehicle: null, lastActive: '30 min ago' },
  { id: 'd6', name: 'Suresh Kumar', licenseNumber: 'DRV-142', licenseCategory: 'HMV', status: 'Off Duty' as const, contactNumber: '+91 43210 98765', safetyScore: 85, licenseExpiryDate: '2026-11-20', trips: 201, completionRate: 93.1, totalDistance: 71450, vehicle: null, lastActive: '2 hours ago' },
];

export const mockTrips = [
  { id: 'TR-2841', source: 'Ahmedabad', destination: 'Surat', vehicleId: 'v1', driverId: 'd1', status: 'In Transit' as const, departure: '07:30 AM', eta: '12:30 PM', distance: 265, cargoWeight: 8500, plannedDistance: 265, createdAt: '2026-08-19T07:30:00', fuelConsumed: 28 },
  { id: 'TR-2842', source: 'Mumbai', destination: 'Pune', vehicleId: 'v6', driverId: 'd4', status: 'In Transit' as const, departure: '06:00 AM', eta: '10:00 AM', distance: 148, cargoWeight: 15200, plannedDistance: 148, createdAt: '2026-08-19T06:00:00', fuelConsumed: 22 },
  { id: 'TR-2843', source: 'Rajkot', destination: 'Vadodara', vehicleId: 'v4', driverId: 'd2', status: 'In Transit' as const, departure: '08:15 AM', eta: '02:00 PM', distance: 220, cargoWeight: 3800, plannedDistance: 220, createdAt: '2026-08-19T08:15:00', fuelConsumed: 16 },
  { id: 'TR-2838', source: 'Surat', destination: 'Ahmedabad', vehicleId: 'v5', driverId: 'd3', status: 'Completed' as const, departure: '06:30 AM', eta: '11:30 AM', distance: 265, cargoWeight: 10200, plannedDistance: 265, createdAt: '2026-08-18T06:30:00', completedAt: '2026-08-18T11:45:00', fuelConsumed: 30 },
  { id: 'TR-2836', source: 'Ahmedabad', destination: 'Mumbai', vehicleId: 'v3', driverId: 'd4', status: 'Completed' as const, departure: '05:00 AM', eta: '02:00 PM', distance: 524, cargoWeight: 16500, plannedDistance: 524, createdAt: '2026-08-17T05:00:00', completedAt: '2026-08-17T14:30:00', fuelConsumed: 78 },
  { id: 'TR-2845', source: 'Vadodara', destination: 'Rajkot', vehicleId: 'v7', driverId: 'd5', status: 'Scheduled' as const, departure: '09:00 AM', eta: '03:00 PM', distance: 210, cargoWeight: 7800, plannedDistance: 210, createdAt: '2026-08-19T00:00:00' },
  { id: 'TR-2840', source: 'Pune', destination: 'Mumbai', vehicleId: 'v6', driverId: 'd4', status: 'Delayed' as const, departure: '04:00 PM', eta: '08:00 PM', distance: 148, cargoWeight: 18900, plannedDistance: 148, createdAt: '2026-08-18T16:00:00' },
];

export const mockMaintenanceRecords = [
  { id: 'm1', vehicleId: 'v2', vehicle: 'MH-203', service: 'Engine Oil Change', priority: 'Medium' as const, status: 'In Progress' as const, scheduledDate: '2026-08-20', cost: 4500, technician: 'Rajan Mehta' },
  { id: 'm2', vehicleId: 'v3', vehicle: 'MH-102', service: 'Brake Pad Replacement', priority: 'Critical' as const, status: 'Overdue' as const, scheduledDate: '2026-08-15', cost: 12800, technician: 'Sunil Yadav' },
  { id: 'm3', vehicleId: 'v6', vehicle: 'MH-506', service: 'Tire Rotation', priority: 'Low' as const, status: 'Scheduled' as const, scheduledDate: '2026-08-25', cost: 3200, technician: 'Rajan Mehta' },
  { id: 'm4', vehicleId: 'v1', vehicle: 'MH-204', service: 'Air Filter Change', priority: 'Low' as const, status: 'Completed' as const, scheduledDate: '2026-08-10', cost: 1800, technician: 'Anil Sharma' },
  { id: 'm5', vehicleId: 'v5', vehicle: 'MH-410', service: 'Transmission Service', priority: 'High' as const, status: 'Scheduled' as const, scheduledDate: '2026-08-28', cost: 18500, technician: 'Sunil Yadav' },
];

export const mockFuelData = {
  monthlyData: [
    { month: 'Mar', litres: 3200, cost: 288000, efficiency: 8.2 },
    { month: 'Apr', litres: 3450, cost: 310500, efficiency: 8.0 },
    { month: 'May', litres: 3100, cost: 279000, efficiency: 8.4 },
    { month: 'Jun', litres: 3680, cost: 331200, efficiency: 7.8 },
    { month: 'Jul', litres: 3020, cost: 271800, efficiency: 8.6 },
    { month: 'Aug', litres: 2750, cost: 247500, efficiency: 8.9 },
  ],
  weeklyData: [
    { day: 'Mon', litres: 420, cost: 37800 },
    { day: 'Tue', litres: 380, cost: 34200 },
    { day: 'Wed', litres: 510, cost: 45900 },
    { day: 'Thu', litres: 445, cost: 40050 },
    { day: 'Fri', litres: 390, cost: 35100 },
    { day: 'Sat', litres: 320, cost: 28800 },
    { day: 'Sun', litres: 285, cost: 25650 },
  ],
};

export const mockTripPerformance = [
  { month: 'Mar', completed: 38, delayed: 4, cancelled: 2 },
  { month: 'Apr', completed: 42, delayed: 3, cancelled: 1 },
  { month: 'May', completed: 35, delayed: 6, cancelled: 3 },
  { month: 'Jun', completed: 45, delayed: 5, cancelled: 2 },
  { month: 'Jul', completed: 40, delayed: 3, cancelled: 1 },
  { month: 'Aug', completed: 42, delayed: 4, cancelled: 1 },
];

export const mockRecentActivity = [
  { id: 'a1', message: 'Vehicle MH-204 completed TR-2841', time: '8 minutes ago', type: 'trip' as const, icon: 'truck' },
  { id: 'a2', message: 'Rahul Patel assigned to TR-2845', time: '21 minutes ago', type: 'driver' as const, icon: 'user' },
  { id: 'a3', message: 'Vehicle MH-203 entered maintenance', time: '43 minutes ago', type: 'maintenance' as const, icon: 'wrench' },
  { id: 'a4', message: '₹4,820 fuel expense recorded', time: '1 hour ago', type: 'expense' as const, icon: 'fuel' },
  { id: 'a5', message: 'Trip TR-2838 marked as completed', time: '2 hours ago', type: 'trip' as const, icon: 'check' },
  { id: 'a6', message: 'Driver Neha Gupta went off duty', time: '3 hours ago', type: 'driver' as const, icon: 'user' },
];

export const mockAlerts = [
  { id: 'al1', severity: 'critical' as const, message: 'Vehicle MH-102 requires immediate maintenance', entity: 'MH-102', time: '15 min ago' },
  { id: 'al2', severity: 'warning' as const, message: '5 vehicles have overdue service', entity: 'Fleet', time: '1 hour ago' },
  { id: 'al3', severity: 'info' as const, message: '12 trips scheduled for tomorrow', entity: 'Trips', time: '2 hours ago' },
  { id: 'al4', severity: 'warning' as const, message: 'Driver Suresh Kumar license expiring in 90 days', entity: 'DRV-142', time: '3 hours ago' },
];

export const mockDashboardKpis = {
  totalVehicles: { value: 124, active: 86, trend: 8.4 },
  activeTrips: { value: 42, arrivingSoon: 8, trend: 12.2 },
  drivers: { value: 98, available: 92, trend: null },
  maintenance: { value: 12, overdue: 5, trend: null },
  fuelCost: { value: 248000, label: '₹2.48L', period: 'This month', trend: -3.2 },
  fleetUtilization: { value: 78.4, trend: 4.6 },
};

export const mockFleetHealth = {
  active: 86,
  idle: 23,
  maintenance: 12,
  critical: 3,
  total: 124,
  healthPercentages: {
    healthy: 69,
    warning: 21,
    critical: 10,
  },
};

export const mockNotifications = [
  { id: 'n1', category: 'maintenance' as const, title: 'Maintenance Overdue', message: 'Vehicle MH-102 brake pad replacement is overdue by 4 days.', time: '15 min ago', read: false },
  { id: 'n2', category: 'trips' as const, title: 'Trip Completed', message: 'TR-2838 (Surat → Ahmedabad) completed successfully.', time: '2 hours ago', read: false },
  { id: 'n3', category: 'vehicles' as const, title: 'Vehicle Status Changed', message: 'MH-203 status changed to In Maintenance.', time: '3 hours ago', read: true },
  { id: 'n4', category: 'expenses' as const, title: 'Fuel Expense Logged', message: '₹4,820 fuel expense recorded for MH-204.', time: '4 hours ago', read: true },
  { id: 'n5', category: 'system' as const, title: 'System Update', message: 'TransitOps v2.4 has been deployed with new analytics features.', time: '1 day ago', read: true },
];

// Analytics mock data
export const mockAnalyticsData = {
  fleetUtilization: [
    { month: 'Mar', value: 72 },
    { month: 'Apr', value: 75 },
    { month: 'May', value: 71 },
    { month: 'Jun', value: 78 },
    { month: 'Jul', value: 76 },
    { month: 'Aug', value: 78.4 },
  ],
  costPerKm: [
    { month: 'Mar', value: 12.4 },
    { month: 'Apr', value: 11.8 },
    { month: 'May', value: 12.1 },
    { month: 'Jun', value: 13.2 },
    { month: 'Jul', value: 11.5 },
    { month: 'Aug', value: 11.2 },
  ],
  expenseBreakdown: [
    { name: 'Fuel', value: 248000, color: 'var(--color-warning)' },
    { name: 'Maintenance', value: 85000, color: 'var(--color-purple)' },
    { name: 'Toll', value: 42000, color: 'var(--color-info)' },
    { name: 'Driver Expenses', value: 36000, color: 'var(--color-success)' },
    { name: 'Other', value: 18000, color: 'var(--color-text-muted)' },
  ],
  driverPerformance: [
    { name: 'Rahul Patel', score: 94, trips: 124, onTime: 96.8 },
    { name: 'Priya Sharma', score: 97, trips: 98, onTime: 98.2 },
    { name: 'Amit Singh', score: 88, trips: 156, onTime: 94.5 },
    { name: 'Vikram Reddy', score: 91, trips: 143, onTime: 95.8 },
    { name: 'Neha Gupta', score: 96, trips: 87, onTime: 97.5 },
  ],
};
