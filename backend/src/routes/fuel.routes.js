// ─────────────────────────────────────────────────────────
// Fuel Routes
// All routes require authentication
// Modification restricted to FINANCIAL_ANALYST and FLEET_MANAGER
// ─────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();

const {
  getAllFuelLogs,
  getFuelLogById,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog,
} = require('../controllers/fuel.controller');

const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// All fuel routes require authentication
router.use(authenticate);

// GET /api/fuel — all authenticated users can view fuel logs
router.get('/', getAllFuelLogs);

// GET /api/fuel/:id — all authenticated users can view detail
router.get('/:id', getFuelLogById);

// POST /api/fuel — Financial Analyst & Fleet Manager can log fuel
router.post('/', authorize('FINANCIAL_ANALYST', 'FLEET_MANAGER'), createFuelLog);

// PUT /api/fuel/:id — Financial Analyst & Fleet Manager can update
router.put('/:id', authorize('FINANCIAL_ANALYST', 'FLEET_MANAGER'), updateFuelLog);

// DELETE /api/fuel/:id — Financial Analyst & Fleet Manager can delete
router.delete('/:id', authorize('FINANCIAL_ANALYST', 'FLEET_MANAGER'), deleteFuelLog);

module.exports = router;
