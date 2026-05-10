import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './docs/openapi/index.js';
import authRoutes from './routes/authRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import movementEventRoutes from './routes/movementEventRoutes.js';
import rfidWebhookRoutes from './routes/rfidWebhookRoutes.js';
import branchRoutes from './routes/branchRoutes.js';
import buildingRoutes from './routes/buildingRoutes.js';
import zoneRoutes from './routes/zoneRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// --- CORS ---------------------------------------------------------------------
app.use(cors());

// --- Body parsers -------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API docs -----------------------------------------------------------------
app.get('/api-docs.json', (_req, res) => res.json(openApiSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// --- Routes -------------------------------------------------------------------
app.get('/', (_req, res) => res.json({ message: 'AssetTrackPro API v1', online: true }));
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/rfid-webhook', rfidWebhookRoutes);
app.use('/api/movement-events', movementEventRoutes);

// --- Global error handler -----------------------------------------------------
app.use(errorHandler);

export default app;
