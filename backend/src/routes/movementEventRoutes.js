import express from 'express';
import * as movementController from '../controllers/movementEventController.js';
import { authenticate, tenantScope } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, tenantScope);

router.get('/', movementController.getAllMovementEvents);
router.get('/:id', movementController.getMovementEventById);
router.post('/simulate', movementController.simulateMovementEvent);

export default router;
