import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { validateApiKey } from '../utils/apiKeyGenerator';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // First check for API key
        const apiKey = req.headers['x-api-key'];
        if (apiKey && typeof apiKey === 'string') {
            if (validateApiKey(apiKey)) {
                next();
                return;
            }
        }

        // Fall back to JWT token check
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        (req as any).user = decoded;
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};