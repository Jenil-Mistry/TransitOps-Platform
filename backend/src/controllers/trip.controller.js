// ─────────────────────────────────────────────────────────
// Trip Controller
// Manages trip lifecycle: DRAFT → DISPATCHED → COMPLETED | CANCELLED
//
// Mandatory Business Rules (PDF Section 4):
//   CREATE:
//     - cargoWeight ≤ vehicle.maxLoadCapacity
//     - Vehicle must be AVAILABLE
//     - Driver must be AVAILABLE
//     - Driver license must not be expired
//     - Driver must not be SUSPENDED
//   DISPATCH:
//     - Trip must be DRAFT
//     - Vehicle & Driver → ON_TRIP (transaction)
//   COMPLETE:
//     - Trip must be DISPATCHED
//     - Vehicle & Driver → AVAILABLE (transaction)
//     - Update odometer, create fuel log
//   CANCEL:
//     - Trip must be DISPATCHED
//     - Vehicle & Driver → AVAILABLE (transaction)
// ─────────────────────────────────────────────────────────

const prisma = require('../config/db');

/**
 * GET /api/trips
 * List all trips with optional filters and pagination
 * Query: ?status=DISPATCHED&page=1&limit=10
 */
const getAllTrips = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const where = {};
    if (status) where.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          vehicle: {
            select: { id: true, registrationNumber: true, name: true, type: true }
          },
          driver: {
            select: { id: true, name: true, licenseNumber: true }
          },
          createdBy: {
            select: { id: true, name: true }
          }
        }
      }),
      prisma.trip.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        trips,
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
 * GET /api/trips/:id
 * Get a single trip with full vehicle and driver details
 */
const getTripById = async (req, res, next) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: {
        vehicle: true,
        driver: true,
        createdBy: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: { message: 'Trip not found.', code: 'NOT_FOUND' }
      });
    }

    res.status(200).json({
      success: true,
      data: { trip }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/trips
 * Create a new trip in DRAFT status
 * Body: { source, destination, vehicleId, driverId, cargoWeight, plannedDistance }
 * 
 * Validates ALL mandatory business rules before creation.
 */
const createTrip = async (req, res, next) => {
  try {
    const { source, destination, vehicleId, driverId, cargoWeight, plannedDistance } = req.body;

    // ─── Validate required fields ─────────────────────
    if (!source || !destination || !vehicleId || !driverId || !cargoWeight || !plannedDistance) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Required fields: source, destination, vehicleId, driverId, cargoWeight, plannedDistance.',
          code: 'MISSING_FIELDS'
        }
      });
    }

    // ─── Fetch vehicle and driver ─────────────────────
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: { message: 'Vehicle not found.', code: 'VEHICLE_NOT_FOUND' }
      });
    }

    const driver = await prisma.driver.findUnique({ where: { id: driverId } });
    if (!driver) {
      return res.status(404).json({
        success: false,
        error: { message: 'Driver not found.', code: 'DRIVER_NOT_FOUND' }
      });
    }

    // ─── Business Rule: Vehicle must be AVAILABLE ─────
    if (vehicle.status !== 'AVAILABLE') {
      return res.status(400).json({
        success: false,
        error: {
          message: `Vehicle '${vehicle.registrationNumber}' is not available. Current status: ${vehicle.status}.`,
          code: 'VEHICLE_NOT_AVAILABLE'
        }
      });
    }

    // ─── Business Rule: Driver must be AVAILABLE ──────
    if (driver.status !== 'AVAILABLE') {
      return res.status(400).json({
        success: false,
        error: {
          message: `Driver '${driver.name}' is not available. Current status: ${driver.status}.`,
          code: 'DRIVER_NOT_AVAILABLE'
        }
      });
    }

    // ─── Business Rule: Driver license not expired ────
    if (new Date(driver.licenseExpiry) < new Date()) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Driver '${driver.name}' has an expired license (expired: ${driver.licenseExpiry.toISOString().split('T')[0]}).`,
          code: 'LICENSE_EXPIRED'
        }
      });
    }

    // ─── Business Rule: Driver not SUSPENDED ──────────
    if (driver.status === 'SUSPENDED') {
      return res.status(400).json({
        success: false,
        error: {
          message: `Driver '${driver.name}' is suspended and cannot be assigned to trips.`,
          code: 'DRIVER_SUSPENDED'
        }
      });
    }

    // ─── Business Rule: Cargo ≤ Max Load Capacity ─────
    if (parseFloat(cargoWeight) > vehicle.maxLoadCapacity) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Cargo weight (${cargoWeight} kg) exceeds vehicle '${vehicle.registrationNumber}' max capacity (${vehicle.maxLoadCapacity} kg).`,
          code: 'OVERWEIGHT'
        }
      });
    }

    // ─── Create trip in DRAFT status ──────────────────
    const trip = await prisma.trip.create({
      data: {
        source,
        destination,
        cargoWeight: parseFloat(cargoWeight),
        plannedDistance: parseFloat(plannedDistance),
        status: 'DRAFT',
        vehicleId,
        driverId,
        createdById: req.user.id,
      },
      include: {
        vehicle: { select: { registrationNumber: true, name: true } },
        driver: { select: { name: true, licenseNumber: true } },
      }
    });

    res.status(201).json({
      success: true,
      data: { trip }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/trips/:id/dispatch
 * Dispatch a DRAFT trip → DISPATCHED
 * Automatically sets Vehicle & Driver status → ON_TRIP (transaction)
 */
const dispatchTrip = async (req, res, next) => {
  try {
    // Fetch the trip
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: { vehicle: true, driver: true }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: { message: 'Trip not found.', code: 'NOT_FOUND' }
      });
    }

    // ─── Business Rule: Trip must be DRAFT ────────────
    if (trip.status !== 'DRAFT') {
      return res.status(400).json({
        success: false,
        error: {
          message: `Cannot dispatch trip. Current status: ${trip.status}. Only DRAFT trips can be dispatched.`,
          code: 'INVALID_STATUS_TRANSITION'
        }
      });
    }

    // ─── Re-validate vehicle & driver availability ────
    // (they may have changed since the trip was created)
    if (trip.vehicle.status !== 'AVAILABLE') {
      return res.status(400).json({
        success: false,
        error: {
          message: `Vehicle '${trip.vehicle.registrationNumber}' is no longer available (${trip.vehicle.status}).`,
          code: 'VEHICLE_NOT_AVAILABLE'
        }
      });
    }

    if (trip.driver.status !== 'AVAILABLE') {
      return res.status(400).json({
        success: false,
        error: {
          message: `Driver '${trip.driver.name}' is no longer available (${trip.driver.status}).`,
          code: 'DRIVER_NOT_AVAILABLE'
        }
      });
    }

    // ─── Transaction: Update trip + vehicle + driver ──
    const updatedTrip = await prisma.$transaction(async (tx) => {
      // 1. Set trip → DISPATCHED
      const dispatched = await tx.trip.update({
        where: { id: trip.id },
        data: {
          status: 'DISPATCHED',
          dispatchedAt: new Date(),
        },
        include: {
          vehicle: { select: { registrationNumber: true, name: true, status: true } },
          driver: { select: { name: true, status: true } },
        }
      });

      // 2. Set vehicle → ON_TRIP
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: 'ON_TRIP' },
      });

      // 3. Set driver → ON_TRIP
      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: 'ON_TRIP' },
      });

      return dispatched;
    });

    res.status(200).json({
      success: true,
      data: {
        trip: updatedTrip,
        message: 'Trip dispatched. Vehicle and driver are now ON_TRIP.',
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/trips/:id/complete
 * Complete a DISPATCHED trip → COMPLETED
 * Body: { actualDistance, fuelConsumed, finalOdometer }
 * Automatically:
 *   - Sets Vehicle & Driver status → AVAILABLE (transaction)
 *   - Updates vehicle odometer
 *   - Creates a FuelLog entry
 */
const completeTrip = async (req, res, next) => {
  try {
    const { actualDistance, fuelConsumed, finalOdometer } = req.body;

    // Validate completion data
    if (!actualDistance || !fuelConsumed) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Required fields: actualDistance, fuelConsumed.',
          code: 'MISSING_FIELDS'
        }
      });
    }

    // Fetch the trip
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: { vehicle: true, driver: true }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: { message: 'Trip not found.', code: 'NOT_FOUND' }
      });
    }

    // ─── Business Rule: Trip must be DISPATCHED ───────
    if (trip.status !== 'DISPATCHED') {
      return res.status(400).json({
        success: false,
        error: {
          message: `Cannot complete trip. Current status: ${trip.status}. Only DISPATCHED trips can be completed.`,
          code: 'INVALID_STATUS_TRANSITION'
        }
      });
    }

    // ─── Transaction: Complete trip + restore statuses + create fuel log ──
    const updatedTrip = await prisma.$transaction(async (tx) => {
      // 1. Set trip → COMPLETED
      const completed = await tx.trip.update({
        where: { id: trip.id },
        data: {
          status: 'COMPLETED',
          actualDistance: parseFloat(actualDistance),
          fuelConsumed: parseFloat(fuelConsumed),
          completedAt: new Date(),
        },
        include: {
          vehicle: { select: { registrationNumber: true, name: true } },
          driver: { select: { name: true } },
        }
      });

      // 2. Set vehicle → AVAILABLE and update odometer
      const odometerValue = finalOdometer
        ? parseFloat(finalOdometer)
        : trip.vehicle.odometer + parseFloat(actualDistance);

      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: {
          status: 'AVAILABLE',
          odometer: odometerValue,
        },
      });

      // 3. Set driver → AVAILABLE
      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: 'AVAILABLE' },
      });

      // 4. Auto-create a FuelLog entry
      await tx.fuelLog.create({
        data: {
          vehicleId: trip.vehicleId,
          liters: parseFloat(fuelConsumed),
          cost: 0, // Can be updated later by Financial Analyst
          date: new Date(),
          odometer: odometerValue,
        }
      });

      return completed;
    });

    res.status(200).json({
      success: true,
      data: {
        trip: updatedTrip,
        message: 'Trip completed. Vehicle and driver are now AVAILABLE. Fuel log created.',
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/trips/:id/cancel
 * Cancel a DISPATCHED trip → CANCELLED
 * Automatically sets Vehicle & Driver status → AVAILABLE (transaction)
 */
const cancelTrip = async (req, res, next) => {
  try {
    const trip = await prisma.trip.findUnique({
      where: { id: req.params.id },
      include: { vehicle: true, driver: true }
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        error: { message: 'Trip not found.', code: 'NOT_FOUND' }
      });
    }

    // ─── Business Rule: Trip must be DISPATCHED ───────
    if (trip.status !== 'DISPATCHED') {
      return res.status(400).json({
        success: false,
        error: {
          message: `Cannot cancel trip. Current status: ${trip.status}. Only DISPATCHED trips can be cancelled.`,
          code: 'INVALID_STATUS_TRANSITION'
        }
      });
    }

    // ─── Transaction: Cancel trip + restore statuses ──
    const updatedTrip = await prisma.$transaction(async (tx) => {
      // 1. Set trip → CANCELLED
      const cancelled = await tx.trip.update({
        where: { id: trip.id },
        data: { status: 'CANCELLED' },
        include: {
          vehicle: { select: { registrationNumber: true, name: true } },
          driver: { select: { name: true } },
        }
      });

      // 2. Set vehicle → AVAILABLE
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: 'AVAILABLE' },
      });

      // 3. Set driver → AVAILABLE
      await tx.driver.update({
        where: { id: trip.driverId },
        data: { status: 'AVAILABLE' },
      });

      return cancelled;
    });

    res.status(200).json({
      success: true,
      data: {
        trip: updatedTrip,
        message: 'Trip cancelled. Vehicle and driver are now AVAILABLE.',
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
};
