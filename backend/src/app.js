import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './docs/openapi/index.js';
import authRoutes from './routes/authRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
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
app.use('/api/assets', assetRoutes);
app.use('/api/employees', employeeRoutes);

// --- Global error handler -----------------------------------------------------
app.use(errorHandler);

export default app;
