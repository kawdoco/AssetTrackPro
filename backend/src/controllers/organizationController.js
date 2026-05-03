import * as organizationService from '../services/organizationService.js';

/**
 * Create a new organization
 * POST /api/organizations
 */
export const createOrganization = async (req, res) => {
  try {
    const { name, industry_type } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Organization name is required',
      });
    }

    const result = await organizationService.createOrganization({
      name,
      industry_type,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Create organization error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create organization',
    });
  }
};

/**
 * Get all organizations
 * GET /api/organizations?page=1&limit=10&search=term&includeInactive=true
 */
export const getOrganizations = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', includeInactive = 'false' } = req.query;

    const result = await organizationService.getOrganizations({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      includeInactive: includeInactive === 'true',
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Get organizations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch organizations',
    });
  }
};

/**
 * Get organization by ID
 * GET /api/organizations/:id
 */
export const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await organizationService.getOrganizationById(id);

    res.status(200).json(result);
  } catch (error) {
    console.error('Get organization error:', error);

    if (error.message === 'Organization not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch organization',
    });
  }
};

/**
 * Update organization
 * PUT /api/organizations/:id
 */
export const updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, industry_type } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Organization name is required',
      });
    }

    const result = await organizationService.updateOrganization(id, {
      name,
      industry_type,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Update organization error:', error);

    if (error.message === 'Organization not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update organization',
    });
  }
};

/**
 * Deactivate organization
 * DELETE /api/organizations/:id
 */
export const deactivateOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await organizationService.deactivateOrganization(id);

    res.status(200).json(result);
  } catch (error) {
    console.error('Deactivate organization error:', error);

    if (error.message === 'Organization not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to deactivate organization',
    });
  }
};

/**
 * Reactivate organization
 * PATCH /api/organizations/:id/reactivate
 */
export const reactivateOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await organizationService.reactivateOrganization(id);

    res.status(200).json(result);
  } catch (error) {
    console.error('Reactivate organization error:', error);

    if (error.message === 'Organization not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to reactivate organization',
    });
  }
};
