// ─────────────────────────────────────────────────────────
// Driver Controller
// CRUD operations for driver profiles
// Business rules:
//   - License number must be unique
//   - Expired license / SUSPENDED drivers excluded from available list
//   - Safety score defaults to 100
// ─────────────────────────────────────────────────────────

const prisma = require('../config/db');

/**
 * GET /api/drivers
 * List all drivers with optional filters and pagination
 * Query: ?status=AVAILABLE&page=1&limit=10
 */
const getAllDrivers = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const where = {};
    if (status) where.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [drivers, total] = await Promise.all([
      prisma.driver.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.driver.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        drivers,
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
 * GET /api/drivers/available
 * List drivers eligible for dispatch:
 *   - Status must be AVAILABLE
 *   - License must NOT be expired
 *   - Must NOT be SUSPENDED
 */
const getAvailableDrivers = async (req, res, next) => {
  try {
    const now = new Date();

    const drivers = await prisma.driver.findMany({
      where: {
        status: 'AVAILABLE',
        licenseExpiry: { gt: now }, // license not expired
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: { drivers }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/drivers/:id
 * Get a single driver by ID with trip history
 */
const getDriverById = async (req, res, next) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: req.params.id },
      include: {
        trips: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            vehicle: {
              select: { registrationNumber: true, name: true }
            }
          }
        },
      }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        error: { message: 'Driver not found.', code: 'NOT_FOUND' }
      });
    }

    // Flag if license is expired
    const isLicenseExpired = new Date(driver.licenseExpiry) < new Date();

    res.status(200).json({
      success: true,
      data: {
        driver: { ...driver, isLicenseExpired }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/drivers
 * Create a new driver profile
 * Body: { name, licenseNumber, licenseCategory, licenseExpiry, contactNumber }
 */
const createDriver = async (req, res, next) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiry, contactNumber } = req.body;

    // Validate required fields
    if (!name || !licenseNumber || !licenseCategory || !licenseExpiry || !contactNumber) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Required fields: name, licenseNumber, licenseCategory, licenseExpiry, contactNumber.',
          code: 'MISSING_FIELDS'
        }
      });
    }

    const driver = await prisma.driver.create({
      data: {
        name,
        licenseNumber,
        licenseCategory,
        licenseExpiry: new Date(licenseExpiry),
        contactNumber,
        safetyScore: 100, // default
      }
    });

    res.status(201).json({
      success: true,
      data: { driver }
    });

  } catch (error) {
    next(error); // P2002 (duplicate licenseNumber) handled by error middleware
  }
};

/**
 * PUT /api/drivers/:id
 * Update a driver's details
 * Body: partial update fields
 */
const updateDriver = async (req, res, next) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiry, contactNumber, safetyScore, status } = req.body;

    // Build update data — only include fields that were provided
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (licenseNumber !== undefined) updateData.licenseNumber = licenseNumber;
    if (licenseCategory !== undefined) updateData.licenseCategory = licenseCategory;
    if (licenseExpiry !== undefined) updateData.licenseExpiry = new Date(licenseExpiry);
    if (contactNumber !== undefined) updateData.contactNumber = contactNumber;
    if (safetyScore !== undefined) updateData.safetyScore = parseInt(safetyScore);
    if (status !== undefined) {
      const validStatuses = ['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: { message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`, code: 'INVALID_STATUS' }
        });
      }
      updateData.status = status;
    }

    const driver = await prisma.driver.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      data: { driver }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/drivers/:id
 * Delete a driver profile
 */
const deleteDriver = async (req, res, next) => {
  try {
    await prisma.driver.delete({
      where: { id: req.params.id },
    });

    res.status(200).json({
      success: true,
      data: { message: 'Driver deleted successfully.' }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDrivers,
  getAvailableDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};
