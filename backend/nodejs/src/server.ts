import express from 'express';
import cors from 'cors';
import { serverConfig } from './config/server.config';
import { setupPassport } from './config/passport';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import networkRoutes from './routes/network.routes';
import passport from 'passport';
import './config/database';

const app = express();

// Middleware
app.use(cors({
  origin: serverConfig.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

// Setup passport
setupPassport(passport);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/network', networkRoutes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(serverConfig.port, () => {
  console.log(`Server running on port ${serverConfig.port} in ${serverConfig.nodeEnv} mode`);
});

export default app;