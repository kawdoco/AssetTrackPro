import express from 'express';
import * as buildingController from '../controllers/buildingController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/',            authorize('admin', 'manager', 'user'), buildingController.getAllBuildings);
router.get('/:id',         authorize('admin', 'manager', 'user'), buildingController.getBuildingById);
router.post('/',           authorize('admin', 'manager'),         buildingController.createBuilding);
router.put('/:id',         authorize('admin', 'manager'),         buildingController.updateBuilding);
router.delete('/:id',      authorize('admin'),                    buildingController.deleteBuilding);
router.get('/:id/zones',   authorize('admin', 'manager', 'user'), buildingController.getBuildingZones);

export default router;