import app from './app.js';
import 'dotenv/config';
import { ensureSeedUser } from './services/bootstrapService.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await ensureSeedUser();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
