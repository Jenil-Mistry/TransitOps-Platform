// ─────────────────────────────────────────────────────────
// Vehicle Routes
// All routes require authentication
// Create/Update/Delete restricted to FLEET_MANAGER
// ─────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();

const {
  getAllVehicles,
  getAvailableVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicle.controller');

const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// All vehicle routes require authentication
router.use(authenticate);

// GET /api/vehicles/available — must be BEFORE /:id to avoid conflict
router.get('/available', authorize('DISPATCHER', 'FLEET_MANAGER'), getAvailableVehicles);

// GET /api/vehicles — all roles can view
router.get('/', getAllVehicles);

// GET /api/vehicles/:id — all roles can view
router.get('/:id', getVehicleById);

// POST /api/vehicles — Fleet Manager only
router.post('/', authorize('FLEET_MANAGER'), createVehicle);

// PUT /api/vehicles/:id — Fleet Manager only
router.put('/:id', authorize('FLEET_MANAGER'), updateVehicle);

// DELETE /api/vehicles/:id — Fleet Manager only
router.delete('/:id', authorize('FLEET_MANAGER'), deleteVehicle);

module.exports = router;
