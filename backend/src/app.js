import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// --- CORS ---------------------------------------------------------------------
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));

// --- Body parsers -------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes -------------------------------------------------------------------
app.get('/', (_req, res) => res.json({ message: 'AssetTrackPro API v2' }));
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);

// --- Global error handler -----------------------------------------------------
app.use(errorHandler);

export default app;
