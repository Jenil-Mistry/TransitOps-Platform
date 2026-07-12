// ─────────────────────────────────────────────────────────
// Vehicle Controller
// CRUD operations for the vehicle registry
// Business rules:
//   - Registration number must be unique
//   - RETIRED/IN_SHOP vehicles excluded from available list
// ─────────────────────────────────────────────────────────

const prisma = require('../config/db');

/**
 * GET /api/vehicles
 * List all vehicles with optional filters and pagination
 * Query: ?type=VAN&status=AVAILABLE&region=North&page=1&limit=10
 */
const getAllVehicles = async (req, res, next) => {
  try {
    const { type, status, region, page = 1, limit = 10 } = req.query;

    // Build filter object
    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (region) where.region = { contains: region, mode: 'insensitive' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.vehicle.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        vehicles,
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
 * GET /api/vehicles/available
 * List only vehicles that are AVAILABLE for dispatch
 * Excludes: ON_TRIP, IN_SHOP, RETIRED
 */
const getAvailableVehicles = async (req, res, next) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { status: 'AVAILABLE' },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: { vehicles }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/vehicles/:id
 * Get a single vehicle by ID with related data
 */
const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
      include: {
        trips: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        maintenanceLogs: {
          orderBy: { startDate: 'desc' },
          take: 5,
        },
        fuelLogs: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      }
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: { message: 'Vehicle not found.', code: 'NOT_FOUND' }
      });
    }

    res.status(200).json({
      success: true,
      data: { vehicle }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/vehicles
 * Create a new vehicle
 * Body: { registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, region }
 */
const createVehicle = async (req, res, next) => {
  try {
    const { registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, region } = req.body;

    // Validate required fields
    if (!registrationNumber || !name || !type || !maxLoadCapacity) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Required fields: registrationNumber, name, type, maxLoadCapacity.',
          code: 'MISSING_FIELDS'
        }
      });
    }

    // Validate vehicle type
    const validTypes = ['VAN', 'TRUCK', 'BUS', 'CAR', 'BIKE'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Invalid vehicle type. Must be one of: ${validTypes.join(', ')}`,
          code: 'INVALID_TYPE'
        }
      });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        registrationNumber,
        name,
        type,
        maxLoadCapacity: parseFloat(maxLoadCapacity),
        odometer: parseFloat(odometer) || 0,
        acquisitionCost: parseFloat(acquisitionCost) || 0,
        region: region || null,
      }
    });

    res.status(201).json({
      success: true,
      data: { vehicle }
    });

  } catch (error) {
    next(error); // Prisma P2002 (duplicate regNumber) handled by error middleware
  }
};

/**
 * PUT /api/vehicles/:id
 * Update a vehicle's details
 * Body: partial update fields
 */
const updateVehicle = async (req, res, next) => {
  try {
    const { registrationNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, region, status } = req.body;

    // Build update data — only include fields that were provided
    const updateData = {};
    if (registrationNumber !== undefined) updateData.registrationNumber = registrationNumber;
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) {
      const validTypes = ['VAN', 'TRUCK', 'BUS', 'CAR', 'BIKE'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          success: false,
          error: { message: `Invalid vehicle type. Must be one of: ${validTypes.join(', ')}`, code: 'INVALID_TYPE' }
        });
      }
      updateData.type = type;
    }
    if (maxLoadCapacity !== undefined) updateData.maxLoadCapacity = parseFloat(maxLoadCapacity);
    if (odometer !== undefined) updateData.odometer = parseFloat(odometer);
    if (acquisitionCost !== undefined) updateData.acquisitionCost = parseFloat(acquisitionCost);
    if (region !== undefined) updateData.region = region;
    if (status !== undefined) {
      const validStatuses = ['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: { message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`, code: 'INVALID_STATUS' }
        });
      }
      updateData.status = status;
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: { vehicle }
    });

  } catch (error) {
    next(error); // P2025 (not found) handled by error middleware
  }
};

/**
 * DELETE /api/vehicles/:id
 * Delete a vehicle from the registry
 */
const deleteVehicle = async (req, res, next) => {
  try {
    await prisma.vehicle.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      data: { message: 'Vehicle deleted successfully.' }
    });

  } catch (error) {
    next(error); // P2025 (not found) handled by error middleware
  }
};

module.exports = {
  getAllVehicles,
  getAvailableVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
