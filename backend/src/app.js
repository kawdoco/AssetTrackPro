import express from 'express';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to AssetTrackPro API' });
});

// Import routes here
// import assetRoutes from './routes/assetRoutes.js';
// app.use('/api/assets', assetRoutes);

export default app;
