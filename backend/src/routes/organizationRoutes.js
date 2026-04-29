import express from 'express';
import * as organizationController from '../controllers/organizationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/organizations
 * Create a new organization
 * Required role: ADMIN
 */
router.post('/', authenticate, authorize('ADMIN'), organizationController.createOrganization);

/**
 * GET /api/organizations
 * Get all organizations with pagination
 * Query params: page, limit, search
 * Required role: ADMIN, MANAGER
 */
router.get('/', authenticate, authorize('ADMIN', 'MANAGER'), organizationController.getOrganizations);

/**
 * GET /api/organizations/:id
 * Get organization by ID with related data
 * Required role: ADMIN, MANAGER
 */
router.get('/:id', authenticate, authorize('ADMIN', 'MANAGER'), organizationController.getOrganizationById);

/**
 * PUT /api/organizations/:id
 * Update organization details
 * Required role: ADMIN
 */
router.put('/:id', authenticate, authorize('ADMIN'), organizationController.updateOrganization);

/**
 * DELETE /api/organizations/:id
 * Deactivate (soft delete) organization
 * Required role: ADMIN
 */
router.delete('/:id', authenticate, authorize('ADMIN'), organizationController.deactivateOrganization);

/**
 * PATCH /api/organizations/:id/reactivate
 * Reactivate organization (change status from inactive to active)
 * Required role: ADMIN
 */
router.patch('/:id/reactivate', authenticate, authorize('ADMIN'), organizationController.reactivateOrganization);

export default router;
