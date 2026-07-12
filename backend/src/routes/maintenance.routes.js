// ─────────────────────────────────────────────────────────
// Maintenance Routes
// All routes require authentication
// Create/Complete/Delete restricted to FLEET_MANAGER
// ─────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();

const {
  getAllMaintenanceLogs,
  getMaintenanceLogById,
  createMaintenanceLog,
  completeMaintenanceLog,
  deleteMaintenanceLog,
} = require('../controllers/maintenance.controller');

const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// All maintenance routes require authentication
router.use(authenticate);

// GET /api/maintenance — all authenticated roles can view maintenance logs
router.get('/', getAllMaintenanceLogs);

// GET /api/maintenance/:id — all authenticated roles can view detail
router.get('/:id', getMaintenanceLogById);

// POST /api/maintenance — Fleet Manager logs new maintenance
router.post('/', authorize('FLEET_MANAGER'), createMaintenanceLog);

// PATCH /api/maintenance/:id/complete — Fleet Manager completes maintenance
router.patch('/:id/complete', authorize('FLEET_MANAGER'), completeMaintenanceLog);

// DELETE /api/maintenance/:id — Fleet Manager deletes maintenance record
router.delete('/:id', authorize('FLEET_MANAGER'), deleteMaintenanceLog);

module.exports = router;
