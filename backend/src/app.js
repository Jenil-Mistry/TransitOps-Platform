// ─────────────────────────────────────────────────────────
// Express App Configuration
// Central file that sets up middleware, routes, and error handling
// ─────────────────────────────────────────────────────────

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ─── Global Middleware ───────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// ─── Health Check ────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ success: true, message: 'TransitOps API is running' });
});

// ─── API Routes ──────────────────────────────────────────
const authRoutes = require('./routes/auth.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const driverRoutes = require('./routes/driver.routes');
const tripRoutes = require('./routes/trip.routes');

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);

// Future routes will be mounted here:
// app.use('/api/maintenance', maintenanceRoutes);
// app.use('/api/fuel', fuelRoutes);
// app.use('/api/expenses', expenseRoutes);
// app.use('/api/reports', reportRoutes);

// ─── Global Error Handler (must be LAST) ─────────────────
const errorHandler = require('./middleware/error.middleware');
app.use(errorHandler);

module.exports = app;