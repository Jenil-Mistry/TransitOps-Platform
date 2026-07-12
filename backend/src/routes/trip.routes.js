// ─────────────────────────────────────────────────────────
// Trip Routes
// All routes require authentication
// Trip creation and lifecycle actions restricted to DISPATCHER
// ─────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();

const {
  getAllTrips,
  getTripById,
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
} = require('../controllers/trip.controller');

const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// All trip routes require authentication
router.use(authenticate);

// GET /api/trips — all roles can view trips
router.get('/', getAllTrips);

// GET /api/trips/:id — all roles can view trip detail
router.get('/:id', getTripById);

// POST /api/trips — Dispatcher creates trips
router.post('/', authorize('DISPATCHER'), createTrip);

// PATCH /api/trips/:id/dispatch — Dispatcher dispatches trips
router.patch('/:id/dispatch', authorize('DISPATCHER'), dispatchTrip);

// PATCH /api/trips/:id/complete — Dispatcher completes trips
router.patch('/:id/complete', authorize('DISPATCHER'), completeTrip);

// PATCH /api/trips/:id/cancel — Dispatcher cancels trips
router.patch('/:id/cancel', authorize('DISPATCHER'), cancelTrip);

module.exports = router;
