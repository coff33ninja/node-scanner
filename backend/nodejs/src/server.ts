import express from 'express';
import cors from 'cors';
import { serverConfig } from './config/server.config';
import { setupPassport } from './config/passport';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter, securityHeaders, validateRequest } from './services/securityEnhancer';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import networkRoutes from './routes/network.routes';
import databaseRoutes from './routes/database.routes';
import serverRoutes from './routes/server.routes';
import passport from 'passport';
import { initializeCleanDatabase } from './utils/dbInit';
import fs from 'fs';
import path from 'path';
import { auditLogger } from './services/auditLogger';

const app = express();

// Initialize clean database if it doesn't exist
const cleanDbPath = path.join(__dirname, '../clean-database.sqlite');
if (!fs.existsSync(cleanDbPath)) {
  initializeCleanDatabase();
  auditLogger.log({
    type: 'system',
    action: 'database_init',
    details: { path: cleanDbPath }
  });
}

// Security middleware
app.use(securityHeaders);
app.use(rateLimiter);
app.use(validateRequest);

// Standard middleware
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
  auditLogger.log({
    type: 'system',
    action: 'health_check',
    details: { status: 'healthy' }
  });
  res.status(200).json({ status: 'healthy' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/database', databaseRoutes);
app.use('/api/server', serverRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(serverConfig.port, () => {
  auditLogger.log({
    type: 'system',
    action: 'server_start',
    details: { 
      port: serverConfig.port,
      mode: serverConfig.nodeEnv
    }
  });
  console.log(`Server running on port ${serverConfig.port} in ${serverConfig.nodeEnv} mode`);
});

export default app;