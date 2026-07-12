// ─────────────────────────────────────────────────────────
// Expense Routes
// All routes require authentication
// Modification restricted to FINANCIAL_ANALYST and FLEET_MANAGER
// ─────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();

const {
  getOperationalCostSummary,
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expense.controller');

const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// All routes require authentication
router.use(authenticate);

// GET /api/expenses/summary — summary before /:id to avoid conflict
router.get('/summary', getOperationalCostSummary);

// GET /api/expenses — all authenticated users can view expenses
router.get('/', getAllExpenses);

// GET /api/expenses/:id — single expense detail
router.get('/:id', getExpenseById);

// POST /api/expenses — Financial Analyst & Fleet Manager
router.post('/', authorize('FINANCIAL_ANALYST', 'FLEET_MANAGER'), createExpense);

// PUT /api/expenses/:id — Financial Analyst & Fleet Manager
router.put('/:id', authorize('FINANCIAL_ANALYST', 'FLEET_MANAGER'), updateExpense);

// DELETE /api/expenses/:id — Financial Analyst & Fleet Manager
router.delete('/:id', authorize('FINANCIAL_ANALYST', 'FLEET_MANAGER'), deleteExpense);

module.exports = router;
