import express from 'express';
import cors from 'cors';
import { serverConfig } from './config/server.config'; // Removed .js extension
import { setupPassport } from './config/passport';
import { errorHandler } from './middleware/errorHandler';
import userRoutes from './routes/user.routes';
import networkRoutes from './routes/network.routes';
import databaseRoutes from './routes/database.routes';
import passport from 'passport';
import { initializeCleanDatabase } from './utils/dbInit';
import fs from 'fs';
import path from 'path';
import { networkScanController } from './controllers/networkScan.controller'; // Importing the network scan controller

const app = express();

// Initialize clean database if it doesn't exist
const cleanDbPath = path.join(__dirname, '../clean-database.sqlite');
if (!fs.existsSync(cleanDbPath)) {
  initializeCleanDatabase();
}

// Middleware
app.use(cors({
  origin: serverConfig.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// Setup passport
setupPassport(passport);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/database', databaseRoutes);
app.post('/api/network/scan', networkScanController.scan); // Adding the network scan route

// Error handling
app.use(errorHandler);

// Start server
app.listen(serverConfig.port, () => {
  console.log(`Server running on port ${serverConfig.port} in ${serverConfig.nodeEnv} mode`);
});

export default app;
