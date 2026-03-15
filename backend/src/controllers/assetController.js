import * as assetService from '../services/assetService.js';

export const getAllAssets = async (req, res) => {
  try {
    const assets = await assetService.listAssets(req.organization_id, req.query);

    res.status(200).json({
      success: true,
      data: assets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch assets',
    });
  }
};

export const getAssetById = async (req, res) => {
  try {
    const asset = await assetService.getAssetById(req.params.id, req.organization_id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found',
      });
    }

    res.status(200).json({
      success: true,
      data: asset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch asset',
    });
  }
};

export const createAsset = async (req, res) => {
  try {
    const { asset_tag_uid, asset_type } = req.body;

    if (!asset_tag_uid || !asset_type) {
      return res.status(400).json({
        success: false,
        message: 'asset_tag_uid and asset_type are required',
      });
    }

    const asset = await assetService.createAsset(req.organization_id, req.body);

    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: asset,
    });
  } catch (error) {
    const statusCode = error.code === 'P2002' ? 409 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to create asset',
    });
  }
};

export const updateAsset = async (req, res) => {
  try {
    const asset = await assetService.updateAsset(req.params.id, req.organization_id, req.body);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Asset updated successfully',
      data: asset,
    });
  } catch (error) {
    const statusCode = error.code === 'P2002' ? 409 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to update asset',
    });
  }
};

export const deleteAsset = async (req, res) => {
  try {
    const result = await assetService.deleteAsset(req.params.id, req.organization_id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found',
      });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete asset',
    });
  }
};
