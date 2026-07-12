// ─────────────────────────────────────────────────────────
// Driver Routes
// All routes require authentication
// Create/Update restricted to DISPATCHER and FLEET_MANAGER
// Delete restricted to FLEET_MANAGER
// ─────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();

const {
  getAllDrivers,
  getAvailableDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
} = require('../controllers/driver.controller');

const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// All driver routes require authentication
router.use(authenticate);

// GET /api/drivers/available — must be BEFORE /:id to avoid conflict
router.get('/available', authorize('DISPATCHER', 'FLEET_MANAGER'), getAvailableDrivers);

// GET /api/drivers — all roles can view
router.get('/', getAllDrivers);

// GET /api/drivers/:id — all roles can view
router.get('/:id', getDriverById);

// POST /api/drivers — Dispatcher and Fleet Manager
router.post('/', authorize('DISPATCHER', 'FLEET_MANAGER'), createDriver);

// PUT /api/drivers/:id — Dispatcher and Fleet Manager
router.put('/:id', authorize('DISPATCHER', 'FLEET_MANAGER'), updateDriver);

// DELETE /api/drivers/:id — Fleet Manager only
router.delete('/:id', authorize('FLEET_MANAGER'), deleteDriver);

module.exports = router;
