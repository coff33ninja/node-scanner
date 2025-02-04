import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { validateApiKey } from '../utils/apiKeyGenerator';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for API key first
    const apiKey = req.headers['x-api-key'];
    if (apiKey && typeof apiKey === 'string') {
      const isValidApiKey = await validateApiKey(apiKey);
      if (isValidApiKey) {
        next();
        return;
      }
    }

    // Fall back to JWT token check
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication Error',
        message: 'No authentication token provided' 
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      (req as any).user = decoded;
      next();
    } catch (jwtError) {
      logger.error('JWT Verification Error:', jwtError);
      return res.status(401).json({ 
        success: false,
        error: 'Authentication Error',
        message: 'Invalid or expired token' 
      });
    }
  } catch (error) {
    logger.error('Authentication Middleware Error:', error);
    next(error);
  }
};