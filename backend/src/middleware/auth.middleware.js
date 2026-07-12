// ─────────────────────────────────────────────────────────
// JWT Authentication Middleware
// Verifies the Bearer token and attaches user to req.user
// ─────────────────────────────────────────────────────────

const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

/**
 * Middleware: authenticate
 * 
 * Extracts JWT from the Authorization header (Bearer <token>),
 * verifies it, fetches the user from DB, and attaches to req.user.
 * 
 * Usage: router.get('/protected', authenticate, handler)
 */
const authenticate = async (req, res, next) => {
  try {
    // 1. Extract token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { message: 'Access denied. No token provided.', code: 'NO_TOKEN' }
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user in database (ensure they still exist)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'User no longer exists.', code: 'USER_NOT_FOUND' }
      });
    }

    // 4. Attach user to request object for downstream use
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid token.', code: 'INVALID_TOKEN' }
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: { message: 'Token has expired. Please login again.', code: 'TOKEN_EXPIRED' }
      });
    }

    next(error);
  }
};

module.exports = authenticate;
