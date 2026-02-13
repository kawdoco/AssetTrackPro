import express from 'express';
import * as assetController from '../controllers/assetController.js';

const router = express.Router();

// Asset routes
router.get('/', assetController.getAllAssets);
router.get('/:id', assetController.getAssetById);
router.post('/', assetController.createAsset);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);

export default router;
