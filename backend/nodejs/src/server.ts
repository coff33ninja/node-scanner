import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import { rateLimit } from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { setupPassport } from './config/passport';
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';
import { logger } from './utils/logger';
import { apiLimiter, authLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());
setupPassport(passport);

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Error handling
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/alttab';
    await mongoose.connect(mongoUri);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
