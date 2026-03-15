import jwt from 'jsonwebtoken';
import { verifyToken, extractToken } from '../utils/jwtUtils.js';

/**
 * Authentication Middleware - Validates JWT token
 * Attaches decoded user data to req.user
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization header required.'
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Attach user data to request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
};

/**
 * Authorization Middleware - Checks user role
 * @param {...string} roles - Allowed roles
 * @example: authorize('ADMIN', 'MANAGER')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required roles: ${roles.join(', ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization check failed'
      });
    }
  };
};

/**
 * Multi-tenant middleware - Filters by organization_id
 * Ensures users can only access their organization's data
 */
export const tenantScope = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Attach organization_id to request for query filtering
    req.organization_id = req.user.organization_id;
    next();
  } catch (error) {
    console.error('Tenant scope error:', error);
    res.status(500).json({
      success: false,
      message: 'Tenant scope check failed'
    });
  }
};
