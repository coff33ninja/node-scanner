import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import { rateLimit } from 'express-rate-limit';
import { errorHandler } from '@/middleware/errorHandler';
import { setupPassport } from '@/config/passport';
import { authRoutes } from '@/routes/auth.routes';
import { userRoutes } from '@/routes/user.routes';
import { logger } from '@/utils/logger';

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
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 login/register requests per windowMs
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Error handling
app.use(errorHandler);

// Database connection with retry logic
const connectDB = async (retries = 5, timeout = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        throw new Error('MONGODB_URI is not defined in environment variables');
      }

      await mongoose.connect(mongoUri);
      logger.info('MongoDB connected successfully');
      return;
    } catch (error) {
      logger.error(`MongoDB connection attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        logger.error('All connection attempts failed. Exiting...');
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, timeout));
    }
  }
};

// Start server only after successful database connection
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;