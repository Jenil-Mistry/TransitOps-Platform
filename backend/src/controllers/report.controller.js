// ─────────────────────────────────────────────────────────
// Report & Analytics Controller
// Provides executive dashboard metrics and detailed operational reports
// ─────────────────────────────────────────────────────────

const prisma = require('../config/db');

/**
 * GET /api/reports/dashboard
 * High-level executive dashboard metrics:
 * - Vehicle status distribution & utilization rate
 * - Active trips vs Completed trips
 * - Active maintenance alerts
 * - Average driver safety score
 */
const getDashboardOverview = async (req, res, next) => {
  try {
    const [
      totalVehicles,
      availableVehicles,
      onTripVehicles,
      inShopVehicles,
      retiredVehicles,
      activeTrips,
      completedTrips,
      activeMaintenance,
      driverStats,
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: 'AVAILABLE' } }),
      prisma.vehicle.count({ where: { status: 'ON_TRIP' } }),
      prisma.vehicle.count({ where: { status: 'IN_SHOP' } }),
      prisma.vehicle.count({ where: { status: 'RETIRED' } }),
      prisma.trip.count({ where: { status: 'DISPATCHED' } }),
      prisma.trip.count({ where: { status: 'COMPLETED' } }),
      prisma.maintenanceLog.count({ where: { status: 'ACTIVE' } }),
      prisma.driver.aggregate({
        _avg: { safetyScore: true },
        _count: { id: true }
      }),
    ]);

    const activeFleetCount = totalVehicles - retiredVehicles;
    const utilizationRate = activeFleetCount > 0
      ? parseFloat(((onTripVehicles / activeFleetCount) * 100).toFixed(2))
      : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          fleet: {
            total: totalVehicles,
            available: availableVehicles,
            onTrip: onTripVehicles,
            inShop: inShopVehicles,
            retired: retiredVehicles,
            utilizationRate: `${utilizationRate}%`,
          },
          trips: {
            active: activeTrips,
            completed: completedTrips,
          },
          maintenance: {
            activeAlerts: activeMaintenance,
          },
          drivers: {
            totalCount: driverStats._count.id,
            averageSafetyScore: driverStats._avg.safetyScore
              ? parseFloat(driverStats._avg.safetyScore.toFixed(1))
              : 100,
          }
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reports/fuel-efficiency
 * Calculates fuel efficiency (km/L) per vehicle based on completed trip distances and logged liters
 */
const getFuelEfficiencyReport = async (req, res, next) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { status: { not: 'RETIRED' } },
      select: {
        id: true,
        registrationNumber: true,
        name: true,
        type: true,
        odometer: true,
        trips: {
          where: { status: 'COMPLETED' },
          select: { actualDistance: true }
        },
        fuelLogs: {
          select: { liters: true, cost: true }
        }
      }
    });

    const report = vehicles.map((v) => {
      const totalDistance = v.trips.reduce((sum, t) => sum + (t.actualDistance || 0), 0);
      const totalLiters = v.fuelLogs.reduce((sum, f) => sum + (f.liters || 0), 0);
      const totalFuelCost = v.fuelLogs.reduce((sum, f) => sum + (f.cost || 0), 0);
      const efficiencyKmPerLiter = totalLiters > 0
        ? parseFloat((totalDistance / totalLiters).toFixed(2))
        : 0;

      return {
        vehicleId: v.id,
        registrationNumber: v.registrationNumber,
        name: v.name,
        type: v.type,
        totalCompletedDistanceKm: totalDistance,
        totalFuelLiters: totalLiters,
        totalFuelCost: totalFuelCost,
        efficiencyKmPerLiter,
      };
    });

    res.status(200).json({
      success: true,
      data: { fuelEfficiency: report }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reports/cost-analysis
 * Breakdown of financial expenditure across the entire fleet
 */
const getCostAnalysisReport = async (req, res, next) => {
  try {
    const [fuelAgg, maintenanceAgg, expenseAgg] = await Promise.all([
      prisma.fuelLog.aggregate({ _sum: { cost: true } }),
      prisma.maintenanceLog.aggregate({ _sum: { cost: true } }),
      prisma.expense.groupBy({
        by: ['category'],
        _sum: { amount: true }
      }),
    ]);

    const totalFuelCost = fuelAgg._sum.cost || 0;
    const totalMaintenanceCost = maintenanceAgg._sum.cost || 0;

    let totalTollCost = 0;
    let totalOtherCost = 0;

    expenseAgg.forEach((item) => {
      if (item.category === 'TOLL') totalTollCost += item._sum.amount || 0;
      else if (item.category === 'OTHER') totalOtherCost += item._sum.amount || 0;
      else if (item.category === 'MAINTENANCE') totalMaintenanceCost += item._sum.amount || 0;
    });

    const totalOperationalCost = totalFuelCost + totalMaintenanceCost + totalTollCost + totalOtherCost;

    res.status(200).json({
      success: true,
      data: {
        costAnalysis: {
          totalOperationalCost,
          breakdown: {
            fuel: totalFuelCost,
            maintenance: totalMaintenanceCost,
            tolls: totalTollCost,
            other: totalOtherCost,
          }
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/reports/driver-performance
 * Driver metrics including completion rates and safety scores
 */
const getDriverPerformanceReport = async (req, res, next) => {
  try {
    const drivers = await prisma.driver.findMany({
      select: {
        id: true,
        name: true,
        licenseNumber: true,
        safetyScore: true,
        status: true,
        trips: {
          select: { status: true, actualDistance: true }
        }
      }
    });

    const report = drivers.map((d) => {
      const completedTrips = d.trips.filter((t) => t.status === 'COMPLETED').length;
      const cancelledTrips = d.trips.filter((t) => t.status === 'CANCELLED').length;
      const totalTrips = d.trips.length;
      const totalDistanceDriven = d.trips
        .filter((t) => t.status === 'COMPLETED')
        .reduce((sum, t) => sum + (t.actualDistance || 0), 0);

      const completionRate = totalTrips > 0
        ? parseFloat(((completedTrips / totalTrips) * 100).toFixed(1))
        : 100;

      return {
        driverId: d.id,
        name: d.name,
        licenseNumber: d.licenseNumber,
        status: d.status,
        safetyScore: d.safetyScore,
        totalTrips,
        completedTrips,
        cancelledTrips,
        completionRate: `${completionRate}%`,
        totalDistanceDrivenKm: totalDistanceDriven,
      };
    });

    res.status(200).json({
      success: true,
      data: { driverPerformance: report }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardOverview,
  getFuelEfficiencyReport,
  getCostAnalysisReport,
  getDriverPerformanceReport,
};
