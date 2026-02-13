// Asset Service
import apiClient from './api';

const assetService = {
  // Get all assets
  getAllAssets: async () => {
    return await apiClient.get('/assets');
  },

  // Get single asset
  getAssetById: async (id) => {
    return await apiClient.get(`/assets/${id}`);
  },

  // Create asset
  createAsset: async (data) => {
    return await apiClient.post('/assets', data);
  },

  // Update asset
  updateAsset: async (id, data) => {
    return await apiClient.put(`/assets/${id}`, data);
  },

  // Delete asset
  deleteAsset: async (id) => {
    return await apiClient.delete(`/assets/${id}`);
  },
};

export default assetService;
