import express from 'express';
import * as branchController from '../controllers/branchController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/branches
 * Create a new branch
 * Required role: ADMIN, MANAGER
 */
router.post('/', authenticate, authorize('ADMIN', 'MANAGER'), branchController.createBranch);

/**
 * GET /api/branches
 * Get all branches with pagination
 * Query params: page, limit, search, organization_id, includeInactive
 * Required role: ADMIN, MANAGER, SECURITY
 */
router.get('/', authenticate, authorize('ADMIN', 'MANAGER', 'SECURITY'), branchController.getBranches);

/**
 * GET /api/branches/:id
 * Get branch by ID with related data
 * Required role: ADMIN, MANAGER, SECURITY
 */
router.get('/:id', authenticate, authorize('ADMIN', 'MANAGER', 'SECURITY'), branchController.getBranchById);

/**
 * PUT /api/branches/:id
 * Update branch details
 * Required role: ADMIN, MANAGER
 */
router.put('/:id', authenticate, authorize('ADMIN', 'MANAGER'), branchController.updateBranch);

/**
 * DELETE /api/branches/:id
 * Deactivate (soft delete) branch
 * Required role: ADMIN
 */
router.delete('/:id', authenticate, authorize('ADMIN'), branchController.deactivateBranch);

/**
 * PATCH /api/branches/:id/reactivate
 * Reactivate branch (change status from inactive to active)
 * Required role: ADMIN
 */
router.patch('/:id/reactivate', authenticate, authorize('ADMIN'), branchController.reactivateBranch);

export default router;
