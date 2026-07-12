// ─────────────────────────────────────────────────────────
// Expense Controller
// Manages operational expenses (TOLL, MAINTENANCE, OTHER)
// Also provides operational cost summary per vehicle (Fuel + Maintenance + Expenses)
// ─────────────────────────────────────────────────────────

const prisma = require('../config/db');

/**
 * GET /api/expenses/summary
 * Automatically computes total operational cost (Fuel + Maintenance + Other expenses) per vehicle or overall.
 * Query: ?vehicleId=xxx
 */
const getOperationalCostSummary = async (req, res, next) => {
  try {
    const { vehicleId } = req.query;

    const whereClause = vehicleId ? { vehicleId } : {};

    // Parallel aggregation from FuelLog, MaintenanceLog, and Expense tables
    const [fuelAgg, maintenanceAgg, expenseAgg] = await Promise.all([
      prisma.fuelLog.aggregate({
        where: whereClause,
        _sum: { cost: true, liters: true },
      }),
      prisma.maintenanceLog.aggregate({
        where: whereClause,
        _sum: { cost: true },
      }),
      prisma.expense.aggregate({
        where: whereClause,
        _sum: { amount: true },
      }),
    ]);

    const totalFuelCost = fuelAgg._sum.cost || 0;
    const totalFuelLiters = fuelAgg._sum.liters || 0;
    const totalMaintenanceCost = maintenanceAgg._sum.cost || 0;
    const totalOtherExpenses = expenseAgg._sum.amount || 0;
    const totalOperationalCost = totalFuelCost + totalMaintenanceCost + totalOtherExpenses;

    res.status(200).json({
      success: true,
      data: {
        vehicleId: vehicleId || 'ALL_VEHICLES',
        summary: {
          totalFuelCost,
          totalFuelLiters,
          totalMaintenanceCost,
          totalOtherExpenses,
          totalOperationalCost,
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/expenses
 * List operational expenses with filtering by vehicleId and category, plus pagination
 * Query: ?vehicleId=xxx&category=TOLL&page=1&limit=10
 */
const getAllExpenses = async (req, res, next) => {
  try {
    const { vehicleId, category, page = 1, limit = 10 } = req.query;

    const where = {};
    if (vehicleId) where.vehicleId = vehicleId;
    if (category) where.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
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
      prisma.expense.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        expenses,
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
 * GET /api/expenses/:id
 * Get a single expense record by ID
 */
const getExpenseById = async (req, res, next) => {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id: req.params.id },
      include: { vehicle: true }
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: { message: 'Expense record not found.', code: 'NOT_FOUND' }
      });
    }

    res.status(200).json({
      success: true,
      data: { expense }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/expenses
 * Create a new operational expense
 * Body: { vehicleId, category, description, amount, date }
 */
const createExpense = async (req, res, next) => {
  try {
    const { vehicleId, category, description, amount, date } = req.body;

    // Validate required fields
    if (!vehicleId || !category || amount === undefined || !date) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Required fields: vehicleId, category, amount, date.',
          code: 'MISSING_FIELDS'
        }
      });
    }

    const validCategories = ['TOLL', 'MAINTENANCE', 'OTHER'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
          code: 'INVALID_CATEGORY'
        }
      });
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: { message: 'Vehicle not found.', code: 'VEHICLE_NOT_FOUND' }
      });
    }

    const expense = await prisma.expense.create({
      data: {
        vehicleId,
        category,
        description: description || null,
        amount: parseFloat(amount),
        date: new Date(date),
      },
      include: {
        vehicle: { select: { registrationNumber: true, name: true } }
      }
    });

    res.status(201).json({
      success: true,
      data: { expense }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/expenses/:id
 * Partial update for an expense record
 */
const updateExpense = async (req, res, next) => {
  try {
    const { category, description, amount, date } = req.body;

    const updateData = {};
    if (category !== undefined) {
      const validCategories = ['TOLL', 'MAINTENANCE', 'OTHER'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          error: { message: `Invalid category. Must be one of: ${validCategories.join(', ')}`, code: 'INVALID_CATEGORY' }
        });
      }
      updateData.category = category;
    }
    if (description !== undefined) updateData.description = description;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (date !== undefined) updateData.date = new Date(date);

    const expense = await prisma.expense.update({
      where: { id: req.params.id },
      data: updateData,
      include: { vehicle: { select: { registrationNumber: true, name: true } } }
    });

    res.status(200).json({
      success: true,
      data: { expense }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/expenses/:id
 * Delete an expense record
 */
const deleteExpense = async (req, res, next) => {
  try {
    await prisma.expense.delete({
      where: { id: req.params.id }
    });

    res.status(200).json({
      success: true,
      data: { message: 'Expense record deleted successfully.' }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOperationalCostSummary,
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
};
