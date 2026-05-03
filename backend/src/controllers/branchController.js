import * as branchService from '../services/branchService.js';

/**
 * Create a new branch
 * POST /api/branches
 */
export const createBranch = async (req, res) => {
  try {
    const { organization_id, name, city } = req.body;

    if (!organization_id || !name || !city) {
      return res.status(400).json({
        success: false,
        message: 'Organization ID, branch name, and city are required',
      });
    }

    if (name.trim() === '' || city.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Branch name and city cannot be empty',
      });
    }

    const result = await branchService.createBranch({
      organization_id,
      name,
      city,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Create branch error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create branch',
    });
  }
};

/**
 * Get all branches
 * GET /api/branches?page=1&limit=10&search=term&organization_id=1&includeInactive=true
 */
export const getBranches = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', organization_id = null, includeInactive = 'false' } = req.query;

    const result = await branchService.getBranches({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      organization_id,
      includeInactive: includeInactive === 'true',
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Get branches error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch branches',
    });
  }
};

/**
 * Get branch by ID
 * GET /api/branches/:id
 */
export const getBranchById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await branchService.getBranchById(id);

    res.status(200).json(result);
  } catch (error) {
    console.error('Get branch error:', error);

    if (error.message === 'Branch not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch branch',
    });
  }
};

/**
 * Update branch
 * PUT /api/branches/:id
 */
export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, city, status } = req.body;

    if (!name && !city && !status) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (name, city, or status) is required for update',
      });
    }

    const result = await branchService.updateBranch(id, {
      name,
      city,
      status,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Update branch error:', error);

    if (error.message === 'Branch not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update branch',
    });
  }
};

/**
 * Deactivate (soft delete) branch
 * DELETE /api/branches/:id
 */
export const deactivateBranch = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await branchService.deactivateBranch(id);

    res.status(200).json(result);
  } catch (error) {
    console.error('Deactivate branch error:', error);

    if (error.message === 'Branch not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to deactivate branch',
    });
  }
};

/**
 * Reactivate branch
 * PATCH /api/branches/:id/reactivate
 */
export const reactivateBranch = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await branchService.reactivateBranch(id);

    res.status(200).json(result);
  } catch (error) {
    console.error('Reactivate branch error:', error);

    if (error.message === 'Branch not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to reactivate branch',
    });
  }
};

/**
 * Get branch map data
 * GET /api/branches/:id/map
 */
export const getBranchMap = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await branchService.getBranchMap(id);
    res.status(200).json(result);
  } catch (error) {
    console.error('Get branch map error:', error);

    if (error.message === 'Branch not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch branch map',
    });
  }
};

/**
 * Update branch map data
 * PUT /api/branches/:id/map
 */
export const updateBranchMap = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await branchService.updateBranchMap(id, req.body || {});
    res.status(200).json(result);
  } catch (error) {
    console.error('Update branch map error:', error);

    if (error.message === 'Branch not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update branch map',
    });
  }
};
