import express from 'express';
import * as zoneController from '../controllers/zoneController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/zones
 * Create a new zone
 * Required role: ADMIN, MANAGER
 */
router.post('/', authenticate, authorize('ADMIN', 'MANAGER'), zoneController.createZone);

/**
 * GET /api/zones
 * Get all zones with pagination
 * Query params: page, limit, search, building_id, zone_type
 * Required role: ADMIN, MANAGER, SECURITY
 */
router.get('/', authenticate, authorize('ADMIN', 'MANAGER', 'SECURITY'), zoneController.getZones);

/**
 * GET /api/zones/:id
 * Get zone by ID with related data
 * Required role: ADMIN, MANAGER, SECURITY
 */
router.get('/:id', authenticate, authorize('ADMIN', 'MANAGER', 'SECURITY'), zoneController.getZoneById);

/**
 * PUT /api/zones/:id
 * Update zone details
 * Required role: ADMIN, MANAGER
 */
router.put('/:id', authenticate, authorize('ADMIN', 'MANAGER'), zoneController.updateZone);

/**
 * DELETE /api/zones/:id
 * Delete zone
 * Required role: ADMIN
 */
router.delete('/:id', authenticate, authorize('ADMIN'), zoneController.deleteZone);

export default router;