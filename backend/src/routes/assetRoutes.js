import express from 'express';
import * as assetController from '../controllers/assetController.js';
import { authenticate, authorize, tenantScope } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, tenantScope);

router.get('/', assetController.getAllAssets);
router.get('/:id', assetController.getAssetById);
router.post('/', authorize('ADMIN', 'MANAGER'), assetController.createAsset);
router.put('/:id', authorize('ADMIN', 'MANAGER'), assetController.updateAsset);
router.delete('/:id', authorize('ADMIN'), assetController.deleteAsset);

export default router;
