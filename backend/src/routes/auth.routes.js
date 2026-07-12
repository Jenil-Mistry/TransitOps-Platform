// ─────────────────────────────────────────────────────────
// Auth Routes
// POST /api/auth/register  — Create a new user
// POST /api/auth/login     — Login and get JWT
// GET  /api/auth/me        — Get current user profile
// ─────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/auth.controller');
const authenticate = require('../middleware/auth.middleware');

// Public routes (no token required)
router.post('/register', register);
router.post('/login', login);

// Protected route (token required)
router.get('/me', authenticate, getMe);

module.exports = router;
