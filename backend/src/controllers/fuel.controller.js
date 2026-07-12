// ─────────────────────────────────────────────────────────
// Fuel Controller
// Manages fuel consumption logs tied to vehicles
// ─────────────────────────────────────────────────────────

const prisma = require('../config/db');

/**
 * GET /api/fuel
 * List all fuel logs with optional filtering by vehicleId and pagination
 * Query: ?vehicleId=xxx&page=1&limit=10
 */
const getAllFuelLogs = async (req, res, next) => {
  try {
    const { vehicleId, page = 1, limit = 10 } = req.query;

    const where = {};
    if (vehicleId) where.vehicleId = vehicleId;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [logs, total] = await Promise.all([
      prisma.fuelLog.findMany({
        where,
        skip,
        take,
        orderBy: { date: 'desc' },
        include: {
          vehicle: {
            select: { id: true, registrationNumber: true, name: true, type: true }
          }
        }
      }),
      prisma.fuelLog.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        fuelLogs: logs,
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
 * GET /api/fuel/:id
 * Get a single fuel log by ID with vehicle details
 */
const getFuelLogById = async (req, res, next) => {
  try {
    const log = await prisma.fuelLog.findUnique({
      where: { id: req.params.id },
      include: {
        vehicle: true
      }
    });

    if (!log) {
      return res.status(404).json({
        success: false,
        error: { message: 'Fuel log not found.', code: 'NOT_FOUND' }
      });
    }

    res.status(200).json({
      success: true,
      data: { fuelLog: log }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/fuel
 * Record a new fuel log
 * Body: { vehicleId, liters, cost, date, odometer }
 * If odometer reading is provided and greater than vehicle's current odometer, updates vehicle odometer.
 */
const createFuelLog = async (req, res, next) => {
  try {
    const { vehicleId, liters, cost, date, odometer } = req.body;

    // Validate required fields
    if (!vehicleId || liters === undefined || cost === undefined || !date) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Required fields: vehicleId, liters, cost, date.',
          code: 'MISSING_FIELDS'
        }
      });
    }

    // Check vehicle exists
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: { message: 'Vehicle not found.', code: 'VEHICLE_NOT_FOUND' }
      });
    }

    const parsedOdometer = odometer !== undefined ? parseFloat(odometer) : null;

    // Transaction: Create fuel log + update odometer if higher
    const log = await prisma.$transaction(async (tx) => {
      const newLog = await tx.fuelLog.create({
        data: {
          vehicleId,
          liters: parseFloat(liters),
          cost: parseFloat(cost),
          date: new Date(date),
          odometer: parsedOdometer,
        },
        include: {
          vehicle: {
            select: { registrationNumber: true, name: true }
          }
        }
      });

      // Update vehicle odometer if new reading exceeds current reading
      if (parsedOdometer !== null && parsedOdometer > vehicle.odometer) {
        await tx.vehicle.update({
          where: { id: vehicleId },
          data: { odometer: parsedOdometer }
        });
      }

      return newLog;
    });

    res.status(201).json({
      success: true,
      data: { fuelLog: log }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/fuel/:id
 * Partial update for a fuel log
 */
const updateFuelLog = async (req, res, next) => {
  try {
    const { liters, cost, date, odometer } = req.body;

    const updateData = {};
    if (liters !== undefined) updateData.liters = parseFloat(liters);
    if (cost !== undefined) updateData.cost = parseFloat(cost);
    if (date !== undefined) updateData.date = new Date(date);
    if (odometer !== undefined) updateData.odometer = parseFloat(odometer);

    const log = await prisma.fuelLog.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        vehicle: {
          select: { registrationNumber: true, name: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: { fuelLog: log }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/fuel/:id
 * Delete a fuel log entry
 */
const deleteFuelLog = async (req, res, next) => {
  try {
    await prisma.fuelLog.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({
      success: true,
      data: { message: 'Fuel log deleted successfully.' }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFuelLogs,
  getFuelLogById,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog,
};
