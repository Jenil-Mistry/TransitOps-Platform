// ─────────────────────────────────────────────────────────
// Prisma Seed Script
// Populates Neon PostgreSQL with realistic test data across all modules
// Run via: npx prisma db seed
// ─────────────────────────────────────────────────────────

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for TransitOps Platform...');

  // 1. Clean up existing data (in reverse dependency order)
  console.log('🧹 Cleaning up existing records...');
  await prisma.fuelLog.deleteMany({});
  await prisma.expense.deleteMany({});
  await prisma.maintenanceLog.deleteMany({});
  await prisma.trip.deleteMany({});
  await prisma.driver.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Create Users across all 4 roles
  console.log('👥 Creating users for all 4 roles...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const fleetManager = await prisma.user.create({
    data: {
      email: 'manager@transitops.com',
      password: hashedPassword,
      name: 'Sarah Connor (Fleet Manager)',
      role: 'FLEET_MANAGER',
    }
  });

  const dispatcher = await prisma.user.create({
    data: {
      email: 'dispatcher@transitops.com',
      password: hashedPassword,
      name: 'Alex Murphy (Dispatcher)',
      role: 'DISPATCHER',
    }
  });

  const safetyOfficer = await prisma.user.create({
    data: {
      email: 'safety@transitops.com',
      password: hashedPassword,
      name: 'Ellen Ripley (Safety Officer)',
      role: 'SAFETY_OFFICER',
    }
  });

  const financialAnalyst = await prisma.user.create({
    data: {
      email: 'finance@transitops.com',
      password: hashedPassword,
      name: 'Gordon Gekko (Financial Analyst)',
      role: 'FINANCIAL_ANALYST',
    }
  });

  // 3. Create Vehicles
  console.log('🚚 Creating vehicles...');
  const van1 = await prisma.vehicle.create({
    data: {
      registrationNumber: 'V-101-NY',
      name: 'Ford Transit Cargo Van #1',
      type: 'VAN',
      maxLoadCapacity: 1500,
      odometer: 45200,
      acquisitionCost: 42000,
      region: 'North',
      status: 'AVAILABLE',
    }
  });

  const truck1 = await prisma.vehicle.create({
    data: {
      registrationNumber: 'T-502-NJ',
      name: 'Volvo FH16 Freight Truck #2',
      type: 'TRUCK',
      maxLoadCapacity: 18000,
      odometer: 112400,
      acquisitionCost: 145000,
      region: 'East',
      status: 'AVAILABLE',
    }
  });

  const truck2 = await prisma.vehicle.create({
    data: {
      registrationNumber: 'T-503-PA',
      name: 'Scania R500 Heavy Truck #3',
      type: 'TRUCK',
      maxLoadCapacity: 22000,
      odometer: 89100,
      acquisitionCost: 160000,
      region: 'East',
      status: 'ON_TRIP',
    }
  });

  const bus1 = await prisma.vehicle.create({
    data: {
      registrationNumber: 'B-301-CT',
      name: 'Mercedes-Benz Sprinter Passenger Bus',
      type: 'BUS',
      maxLoadCapacity: 2500,
      odometer: 62000,
      acquisitionCost: 68000,
      region: 'North',
      status: 'IN_SHOP',
    }
  });

  const bike1 = await prisma.vehicle.create({
    data: {
      registrationNumber: 'K-901-NY',
      name: 'Honda CB500X Express Delivery Bike',
      type: 'BIKE',
      maxLoadCapacity: 80,
      odometer: 14500,
      acquisitionCost: 7500,
      region: 'Metro',
      status: 'AVAILABLE',
    }
  });

  // 4. Create Drivers
  console.log('🧑‍✈️ Creating drivers...');
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 2);

  const driver1 = await prisma.driver.create({
    data: {
      name: 'Dominic Toretto',
      licenseNumber: 'DL-882910-NY',
      licenseCategory: 'Heavy Commercial (Class A)',
      licenseExpiry: nextYear,
      contactNumber: '+1-555-0192',
      safetyScore: 98,
      status: 'AVAILABLE',
    }
  });

  const driver2 = await prisma.driver.create({
    data: {
      name: 'Letty Ortiz',
      licenseNumber: 'DL-443190-NJ',
      licenseCategory: 'Heavy Commercial (Class A)',
      licenseExpiry: nextYear,
      contactNumber: '+1-555-0193',
      safetyScore: 95,
      status: 'ON_TRIP',
    }
  });

  const driver3 = await prisma.driver.create({
    data: {
      name: 'Brian OConner',
      licenseNumber: 'DL-119283-PA',
      licenseCategory: 'Light / Van (Class C)',
      licenseExpiry: nextYear,
      contactNumber: '+1-555-0194',
      safetyScore: 100,
      status: 'AVAILABLE',
    }
  });

  const driver4 = await prisma.driver.create({
    data: {
      name: 'Roman Pearce',
      licenseNumber: 'DL-665123-CT',
      licenseCategory: 'Passenger / Bus (Class B)',
      licenseExpiry: nextYear,
      contactNumber: '+1-555-0195',
      safetyScore: 82,
      status: 'AVAILABLE',
    }
  });

  // 5. Create Trips
  console.log('🗺️ Creating trips...');
  await prisma.trip.create({
    data: {
      source: 'New York Warehouse Hub',
      destination: 'Boston Distribution Center',
      cargoWeight: 1200,
      plannedDistance: 340,
      actualDistance: 345,
      fuelConsumed: 48.5,
      status: 'COMPLETED',
      dispatchedAt: new Date(Date.now() - 86400000 * 3),
      completedAt: new Date(Date.now() - 86400000 * 2),
      vehicleId: van1.id,
      driverId: driver3.id,
      createdById: dispatcher.id,
    }
  });

  await prisma.trip.create({
    data: {
      source: 'Philadelphia Depot',
      destination: 'Pittsburgh Logistics Hub',
      cargoWeight: 16500,
      plannedDistance: 490,
      status: 'DISPATCHED',
      dispatchedAt: new Date(),
      vehicleId: truck2.id,
      driverId: driver2.id,
      createdById: dispatcher.id,
    }
  });

  await prisma.trip.create({
    data: {
      source: 'Queens Sort Center',
      destination: 'Brooklyn Hub',
      cargoWeight: 50,
      plannedDistance: 22,
      status: 'DRAFT',
      vehicleId: bike1.id,
      driverId: driver1.id,
      createdById: dispatcher.id,
    }
  });

  // 6. Create Maintenance Logs
  console.log('🔧 Creating maintenance logs...');
  await prisma.maintenanceLog.create({
    data: {
      vehicleId: bus1.id,
      serviceType: 'Preventive Engine Overhaul & Brake Pad Replacement',
      description: 'Scheduled 60,000 km full diagnostic service and transmission fluid flush.',
      cost: 1850,
      status: 'ACTIVE',
      startDate: new Date(Date.now() - 86400000),
    }
  });

  await prisma.maintenanceLog.create({
    data: {
      vehicleId: truck1.id,
      serviceType: 'Tire Rotation & Alignment',
      description: 'All 10 heavy-duty tires checked and aligned.',
      cost: 420,
      status: 'COMPLETED',
      startDate: new Date(Date.now() - 86400000 * 10),
      endDate: new Date(Date.now() - 86400000 * 9),
    }
  });

  // 7. Create Fuel Logs
  console.log('⛽ Creating fuel logs...');
  await prisma.fuelLog.create({
    data: {
      vehicleId: van1.id,
      liters: 48.5,
      cost: 72.75,
      date: new Date(Date.now() - 86400000 * 2),
      odometer: 45200,
    }
  });

  await prisma.fuelLog.create({
    data: {
      vehicleId: truck1.id,
      liters: 150.0,
      cost: 240.00,
      date: new Date(Date.now() - 86400000 * 5),
      odometer: 112400,
    }
  });

  // 8. Create Expenses
  console.log('🧾 Creating operational expenses...');
  await prisma.expense.create({
    data: {
      vehicleId: van1.id,
      category: 'TOLL',
      description: 'I-95 Northbound Toll plaza crossing',
      amount: 18.50,
      date: new Date(Date.now() - 86400000 * 2),
    }
  });

  await prisma.expense.create({
    data: {
      vehicleId: truck1.id,
      category: 'OTHER',
      description: 'Commercial vehicle weigh station permit fee',
      amount: 45.00,
      date: new Date(Date.now() - 86400000 * 4),
    }
  });

  console.log('✅ Seeding completed successfully!');
  console.log('───────────────────────────────────────────────────');
  console.log('🔐 Test Credentials (Password for all: password123)');
  console.log('   Fleet Manager    -> manager@transitops.com');
  console.log('   Dispatcher       -> dispatcher@transitops.com');
  console.log('   Safety Officer   -> safety@transitops.com');
  console.log('   Financial Analyst-> finance@transitops.com');
  console.log('───────────────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
