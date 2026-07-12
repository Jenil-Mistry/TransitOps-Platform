// ─────────────────────────────────────────────────────────
// Global Error Handler Middleware
// Catches all errors thrown in controllers and sends
// a consistent JSON response
// ─────────────────────────────────────────────────────────

const { Prisma } = require('@prisma/client');

/**
 * Middleware: errorHandler
 * 
 * Must be the LAST middleware mounted in app.js (after all routes).
 * Catches errors thrown via next(error) or unhandled exceptions.
 * 
 * Usage in app.js:
 *   app.use(errorHandler)
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging (will appear in terminal)
  console.error(`[ERROR] ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // ─── Prisma Known Request Errors ───────────────────
  // e.g. unique constraint violation, record not found
  if (err instanceof Prisma.PrismaClientKnownRequestError) {

    // P2002: Unique constraint violation
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'field';
      return res.status(409).json({
        success: false,
        error: {
          message: `A record with this ${field} already exists.`,
          code: 'DUPLICATE_ENTRY',
          field: field
        }
      });
    }

    // P2025: Record not found (for update/delete)
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Record not found.',
          code: 'NOT_FOUND'
        }
      });
    }

    // P2003: Foreign key constraint failure
    if (err.code === 'P2003') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Related record not found. Please check the referenced ID.',
          code: 'FOREIGN_KEY_ERROR'
        }
      });
    }
  }

  // ─── Prisma Validation Errors ──────────────────────
  // e.g. wrong data type, missing required field
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid data provided. Please check your request body.',
        code: 'VALIDATION_ERROR'
      }
    });
  }

  // ─── Express Validator Errors ──────────────────────
  // If validation errors are thrown as an object with an array
  if (err.type === 'VALIDATION_FAILED' && err.errors) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed.',
        code: 'VALIDATION_ERROR',
        details: err.errors
      }
    });
  }

  // ─── Custom Application Errors ─────────────────────
  // Controllers can throw: { statusCode: 400, message: '...' }
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        code: err.code || 'APP_ERROR'
      }
    });
  }

  // ─── Fallback: Unknown / Internal Server Error ─────
  return res.status(500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal server error. Please try again later.',
      code: 'INTERNAL_ERROR'
    }
  });
};

module.exports = errorHandler;
