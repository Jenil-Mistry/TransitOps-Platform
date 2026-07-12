// ─────────────────────────────────────────────────────────
// Role-Based Access Control (RBAC) Middleware
// Restricts route access to specific user roles
// ─────────────────────────────────────────────────────────

/**
 * Middleware: authorize(...allowedRoles)
 * 
 * Higher-order function that returns middleware checking if
 * the authenticated user's role is in the allowed list.
 * 
 * Must be used AFTER the authenticate middleware (req.user must exist).
 * 
 * Usage:
 *   router.post('/vehicles', authenticate, authorize('FLEET_MANAGER'), createVehicle)
 *   router.get('/reports', authenticate, authorize('FINANCIAL_ANALYST', 'FLEET_MANAGER'), getReports)
 * 
 * Roles from schema: FLEET_MANAGER, DISPATCHER, SAFETY_OFFICER, FINANCIAL_ANALYST
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user is set by authenticate middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required before authorization.', code: 'NOT_AUTHENTICATED' }
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: `Access denied. This action requires one of the following roles: ${allowedRoles.join(', ')}. Your role: ${req.user.role}.`,
          code: 'INSUFFICIENT_ROLE'
        }
      });
    }

    next();
  };
};

module.exports = authorize;
