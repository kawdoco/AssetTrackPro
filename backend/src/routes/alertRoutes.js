import express from 'express';
import * as alertController from '../controllers/alertController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/alerts
 * Create a new alert
 * Required role: ADMIN, MANAGER
 */
router.post('/', authenticate, authorize('ADMIN', 'MANAGER'), alertController.createAlert);

/**
 * GET /api/alerts
 * Get all alerts with pagination and filtering
 * Required role: ADMIN, MANAGER
 */
// router.get('/', authenticate, authorize('ADMIN', 'MANAGER'), alertController.getAlerts);

/**
 * GET /api/alerts/:id
 * Get alert by ID
 * Required role: ADMIN, MANAGER
 */
router.get('/:id', authenticate, authorize('ADMIN', 'MANAGER'), alertController.getAlertById);

/**
 * PATCH /api/alerts/:id/acknowledge
 * Acknowledge alert
 * Required role: ADMIN, MANAGER
 */
router.patch('/:id/acknowledge', authenticate, authorize('ADMIN', 'MANAGER'), alertController.acknowledgeAlert);

/**
 * PATCH /api/alerts/:id/resolve
 * Resolve alert
 * Required role: ADMIN, MANAGER
 */
router.patch('/:id/resolve', authenticate, authorize('ADMIN', 'MANAGER'), alertController.resolveAlert);

export default router;
