import * as zoneService from '../services/zoneService.js';

/**
 * Create a new zone
 * POST /api/zones
 */
export const createZone = async (req, res) => {
  try {
    const { building_id, zone_name, zone_type, description } = req.body;

    if (!building_id || !zone_name || !zone_type) {
      return res.status(400).json({
        success: false,
        message: 'Building ID, zone name, and zone type are required',
      });
    }

    if (zone_name.trim() === '' || zone_type.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Zone name and type cannot be empty',
      });
    }

    const result = await zoneService.createZone({
      building_id,
      zone_name,
      zone_type,
      description,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Create zone error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create zone',
    });
  }
};

/**
 * Get all zones
 * GET /api/zones?page=1&limit=10&search=term&building_id=1&zone_type=STORAGE
 */
export const getZones = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', building_id = null, zone_type = null } = req.query;

    const result = await zoneService.getZones({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      building_id,
      zone_type,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Get zones error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch zones',
    });
  }
};

/**
 * Get zone by ID
 * GET /api/zones/:id
 */
export const getZoneById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await zoneService.getZoneById(id);

    res.status(200).json(result);
  } catch (error) {
    console.error('Get zone error:', error);

    if (error.message === 'Zone not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch zone',
    });
  }
};

/**
 * Update zone
 * PUT /api/zones/:id
 */
export const updateZone = async (req, res) => {
  try {
    const { id } = req.params;
    const { zone_name, zone_type, description } = req.body;

    if (!zone_name && !zone_type && description === undefined) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (zone_name, zone_type, or description) is required for update',
      });
    }

    const result = await zoneService.updateZone(id, {
      zone_name,
      zone_type,
      description,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Update zone error:', error);

    if (error.message === 'Zone not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update zone',
    });
  }
};

/**
 * Delete zone
 * DELETE /api/zones/:id
 */
export const deleteZone = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await zoneService.deleteZone(id);

    res.status(200).json(result);
  } catch (error) {
    console.error('Delete zone error:', error);

    if (error.message === 'Zone not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete zone',
    });
  }
};