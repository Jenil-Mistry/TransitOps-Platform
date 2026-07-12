// ─────────────────────────────────────────────────────────
// Report & Analytics Routes
// All routes require authentication
// Accessible across roles (with executive focus on Fleet Managers & Financial Analysts)
// ─────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();

const {
  getDashboardOverview,
  getFuelEfficiencyReport,
  getCostAnalysisReport,
  getDriverPerformanceReport,
} = require('../controllers/report.controller');

const authenticate = require('../middleware/auth.middleware');

// All analytics routes require authentication
router.use(authenticate);

// GET /api/reports/dashboard — Executive dashboard overview
router.get('/dashboard', getDashboardOverview);

// GET /api/reports/fuel-efficiency — Vehicle fuel efficiency (km/L)
router.get('/fuel-efficiency', getFuelEfficiencyReport);

// GET /api/reports/cost-analysis — Financial operational cost breakdown
router.get('/cost-analysis', getCostAnalysisReport);

// GET /api/reports/driver-performance — Driver safety score and trip completion stats
router.get('/driver-performance', getDriverPerformanceReport);

module.exports = router;
