// ─────────────────────────────────────────────────────────
// Maintenance Controller
// Manages maintenance records and automatic vehicle status switches
//
// Mandatory Business Rules (PDF Section 3.6 & 4):
//   CREATE:
//     - Vehicle cannot be ON_TRIP or RETIRED
//     - Automatically switches Vehicle status → IN_SHOP ($transaction)
//     - Removes vehicle from Driver's selection pool
//   COMPLETE:
//     - Switches MaintenanceLog status → COMPLETED
//     - Automatically restores Vehicle status → AVAILABLE (unless RETIRED) ($transaction)
// ─────────────────────────────────────────────────────────

const prisma = require('../config/db');

/**
 * GET /api/maintenance
 * List maintenance logs with optional filtering by vehicleId and status, plus pagination
 * Query: ?vehicleId=xxx&status=ACTIVE&page=1&limit=10
 */
const getAllMaintenanceLogs = async (req, res, next) => {
  try {
    const { vehicleId, status, page = 1, limit = 10 } = req.query;

    const where = {};
    if (vehicleId) where.vehicleId = vehicleId;
    if (status) where.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [logs, total] = await Promise.all([
      prisma.maintenanceLog.findMany({
        where,
        skip,
        take,
        orderBy: { startDate: 'desc' },
        include: {
          vehicle: {
            select: { id: true, registrationNumber: true, name: true, type: true, status: true }
          }
        }
      }),
      prisma.maintenanceLog.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        maintenanceLogs: logs,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / take),
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/maintenance/:id
 * Get a single maintenance record by ID with vehicle details
 */
const getMaintenanceLogById = async (req, res, next) => {
  try {
    const log = await prisma.maintenanceLog.findUnique({
      where: { id: req.params.id },
      include: {
        vehicle: true
      }
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        error: { message: 'Maintenance record not found.', code: 'NOT_FOUND' }
      });
    }

    res.status(200).json({
      success: true,
      data: { maintenanceLog: log }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/maintenance
 * Create a new ACTIVE maintenance record
 * Body: { vehicleId, serviceType, description, cost }
 * Automatically sets vehicle.status → IN_SHOP
 */
const createMaintenanceLog = async (req, res, next) => {
  try {
    const { vehicleId, serviceType, description, cost } = req.body;

    // Validate required fields
    if (!vehicleId || !serviceType) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Required fields: vehicleId, serviceType.',
          code: 'MISSING_FIELDS'
        }
      });
    }

    // Fetch vehicle
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: { message: 'Vehicle not found.', code: 'VEHICLE_NOT_FOUND' }
      });
    }

    // Business Rule: Cannot put an ON_TRIP vehicle into maintenance
    if (vehicle.status === 'ON_TRIP') {
      return res.status(400).json({
        success: false,
        error: {
          message: `Cannot create maintenance log for vehicle '${vehicle.registrationNumber}' because it is currently ON_TRIP. Complete or cancel the trip first.`,
          code: 'VEHICLE_ON_TRIP'
        }
      });
    }

    // Business Rule: Cannot put a RETIRED vehicle into maintenance
    if (vehicle.status === 'RETIRED') {
      return res.status(400).json({
        success: false,
        error: {
          message: `Cannot create maintenance log for vehicle '${vehicle.registrationNumber}' because it has been RETIRED.`,
          code: 'VEHICLE_RETIRED'
        }
      });
    }

    // Transaction: Create maintenance log + switch vehicle status to IN_SHOP
    const result = await prisma.$transaction(async (tx) => {
      const log = await tx.maintenanceLog.create({
        data: {
          vehicleId,
          serviceType,
          description: description || null,
          cost: parseFloat(cost) || 0,
          status: 'ACTIVE',
          startDate: new Date(),
        },
        include: {
          vehicle: {
            select: { registrationNumber: true, name: true, status: true }
          }
        }
      });

      // Update vehicle status to IN_SHOP if not already IN_SHOP
      if (vehicle.status !== 'IN_SHOP') {
        await tx.vehicle.update({
          where: { id: vehicleId },
          data: { status: 'IN_SHOP' }
        });
      }

      return log;
    });

    res.status(201).json({
      success: true,
      data: {
        maintenanceLog: result,
        message: `Maintenance logged. Vehicle '${result.vehicle.registrationNumber}' status switched to IN_SHOP.`
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/maintenance/:id/complete
 * Complete an ACTIVE maintenance record
 * Body: { cost, description } (optional updates on completion)
 * Automatically restores vehicle.status → AVAILABLE (unless RETIRED or other ACTIVE logs exist)
 */
const completeMaintenanceLog = async (req, res, next) => {
  try {
    const { cost, description } = req.body;

    const log = await prisma.maintenanceLog.findUnique({
      where: { id: req.params.id },
      include: { vehicle: true }
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        error: { message: 'Maintenance record not found.', code: 'NOT_FOUND' }
      });
    }

    if (log.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'This maintenance record is already COMPLETED.',
          code: 'ALREADY_COMPLETED'
        }
      });
    }

    // Transaction: Mark log as COMPLETED + check if vehicle can return to AVAILABLE
    const updatedLog = await prisma.$transaction(async (tx) => {
      // 1. Update maintenance log
      const updateData = {
        status: 'COMPLETED',
        endDate: new Date(),
      };
      if (cost !== undefined) updateData.cost = parseFloat(cost);
      if (description !== undefined) updateData.description = description;

      const completedLog = await tx.maintenanceLog.update({
        where: { id: log.id },
        data: updateData,
        include: {
          vehicle: {
            select: { registrationNumber: true, name: true, status: true }
          }
        }
      });

      // 2. Check if vehicle is RETIRED
      if (log.vehicle.status !== 'RETIRED') {
        // Check if there are any other ACTIVE maintenance logs for this vehicle
        const otherActiveCount = await tx.maintenanceLog.count({
          where: {
            vehicleId: log.vehicleId,
            status: 'ACTIVE',
            id: { not: log.id }
          }
        });

        // If no other active maintenance logs, restore vehicle status to AVAILABLE
        if (otherActiveCount === 0) {
          await tx.vehicle.update({
            where: { id: log.vehicleId },
            data: { status: 'AVAILABLE' }
          });
          completedLog.vehicle.status = 'AVAILABLE';
        }
      }

      return completedLog;
    });

    res.status(200).json({
      success: true,
      data: {
        maintenanceLog: updatedLog,
        message: `Maintenance completed. Vehicle '${updatedLog.vehicle.registrationNumber}' status is now ${updatedLog.vehicle.status}.`
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/maintenance/:id
 * Delete a maintenance record
 * If deleting an ACTIVE log, checks if vehicle should revert to AVAILABLE
 */
const deleteMaintenanceLog = async (req, res, next) => {
  try {
    const log = await prisma.maintenanceLog.findUnique({
      where: { id: req.params.id },
      include: { vehicle: true }
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        error: { message: 'Maintenance record not found.', code: 'NOT_FOUND' }
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.maintenanceLog.delete({
        where: { id: log.id }
      });

      // If we deleted an ACTIVE record and the vehicle is IN_SHOP, check if other active logs remain
      if (log.status === 'ACTIVE' && log.vehicle.status === 'IN_SHOP') {
        const remainingActive = await tx.maintenanceLog.count({
          where: {
            vehicleId: log.vehicleId,
            status: 'ACTIVE'
          }
        });

        if (remainingActive === 0) {
          await tx.vehicle.update({
            where: { id: log.vehicleId },
            data: { status: 'AVAILABLE' }
          });
        }
      }
    });

    res.status(200).json({
      success: true,
      data: { message: 'Maintenance record deleted successfully.' }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMaintenanceLogs,
  getMaintenanceLogById,
  createMaintenanceLog,
  completeMaintenanceLog,
  deleteMaintenanceLog,
};
