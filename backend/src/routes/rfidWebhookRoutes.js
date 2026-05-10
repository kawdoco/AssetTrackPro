import express from 'express';
import * as movementController from '../controllers/movementEventController.js';

const router = express.Router();

// Public webhook endpoint for RFID readers/middleware
router.post('/movement-event', movementController.handleRfidWebhook);

export default router;
