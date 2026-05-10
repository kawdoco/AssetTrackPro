import express from 'express';
import * as buildingController from '../controllers/buildingController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/', buildingController.getAllBuildings);
router.get('/:id', buildingController.getBuildingById);
router.post('/', authorize('ADMIN', 'MANAGER'), buildingController.createBuilding);
router.put('/:id', authorize('ADMIN', 'MANAGER'), buildingController.updateBuilding);
router.delete('/:id', authorize('ADMIN', 'MANAGER'), buildingController.deleteBuilding);
router.get('/:id/zones', authorize('ADMIN', 'MANAGER'), buildingController.getBuildingZones);

export default router;