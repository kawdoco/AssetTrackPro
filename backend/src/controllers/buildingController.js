import * as buildingService from '../services/buildingService.js';

// GET /api/buildings
export const getAllBuildings = async (req, res) => {
  try {
    const filters = {
      branch_id : req.query.branch_id ? parseInt(req.query.branch_id) : undefined,
      search    : req.query.search || '',
      page      : parseInt(req.query.page)  || 1,
      limit     : parseInt(req.query.limit) || 10,
    };

    const result = await buildingService.getAllBuildings(filters);

    return res.status(200).json({
      success    : true,
      message    : 'Buildings retrieved successfully',
      data       : result.buildings,
      pagination : result.pagination,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/buildings/:id
export const getBuildingById = async (req, res) => {
  try {
    const id       = parseInt(req.params.id);
    const building = await buildingService.getBuildingById(id);

    if (!building) {
      return res.status(404).json({ success: false, message: 'Building not found' });
    }

    return res.status(200).json({
      success : true,
      message : 'Building retrieved successfully',
      data    : building,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/buildings
export const createBuilding = async (req, res) => {
  try {
    const { branch_id, name } = req.body;

    if (!branch_id || !name) {
      return res.status(400).json({
        success : false,
        message : 'branch_id and name are required',
      });
    }

    const building = await buildingService.createBuilding({
      branch_id : parseInt(branch_id),
      name      : name.trim(),
    });

    return res.status(201).json({
      success : true,
      message : 'Building created successfully',
      data    : building,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success : false,
        message : 'A building with this name already exists in this branch',
      });
    }
    if (error.code === 'P2003') {
      return res.status(404).json({
        success : false,
        message : 'Branch not found',
      });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/buildings/:id
export const updateBuilding = async (req, res) => {
  try {
    const id       = parseInt(req.params.id);
    const existing = await buildingService.getBuildingById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Building not found' });
    }

    const { branch_id, name } = req.body;

    const updateData = {};
    if (branch_id !== undefined) updateData.branch_id = parseInt(branch_id);
    if (name      !== undefined) updateData.name      = name.trim();

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success : false,
        message : 'Provide at least one field to update: branch_id or name',
      });
    }

    const updated = await buildingService.updateBuilding(id, updateData);

    return res.status(200).json({
      success : true,
      message : 'Building updated successfully',
      data    : updated,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        success : false,
        message : 'A building with this name already exists in this branch',
      });
    }
    if (error.code === 'P2003') {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/buildings/:id
export const deleteBuilding = async (req, res) => {
  try {
    const id       = parseInt(req.params.id);
    const existing = await buildingService.getBuildingById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Building not found' });
    }

    await buildingService.deleteBuilding(id);

    return res.status(200).json({
      success : true,
      message : 'Building deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/buildings/:id/zones
export const getBuildingZones = async (req, res) => {
  try {
    const id       = parseInt(req.params.id);
    const existing = await buildingService.getBuildingById(id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Building not found' });
    }

    const zones = await buildingService.getBuildingZones(id);

    return res.status(200).json({
      success : true,
      message : 'Zones retrieved successfully',
      data    : zones,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};