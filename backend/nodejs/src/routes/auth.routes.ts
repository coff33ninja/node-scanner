import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { UserModel, User, UserPreferences } from '../models/user.model';
import { errorHandler } from '../middleware/errorHandler';

const router = Router();

// Registration validation middleware
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
];

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
  name: string;
  language?: string;
  theme?: string;
  notifications?: boolean;
}

// Registration route
router.post(
  '/register',
  registerValidation,
  async (req: Request<Record<string, never>, unknown, RegisterRequestBody>, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password, name, language, theme, notifications } = req.body;

      // Check if user already exists
      const existingUser = await UserModel.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      const existingEmail = await UserModel.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Create user preferences
      const preferences: UserPreferences = {
        language: language || 'en',
        theme: theme || 'system',
        notifications: notifications !== undefined ? notifications : true,
      };

      // Create new user
      const user = await UserModel.create({
        username,
        email,
        password,
        name,
        preferences,
        role: 'user',
        isActive: true,
      });

      if (!user) {
        return res.status(500).json({ message: 'Failed to create user' });
      }

      // Generate tokens
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
        { expiresIn: '7d' }
      );

      // Remove sensitive data before sending response
      const { password: _, ...userData } = user;

      res.status(201).json({
        user: userData,
        token,
        refreshToken,
      });
    } catch (error) {
      console.error('Registration error:', error);
      errorHandler(error, req, res);
    }
  }
);

interface LoginRequestBody {
  username: string;
  password: string;
}

// Login route
router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request<object, object, LoginRequestBody>, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;

      // Find user
      const user = await UserModel.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Verify password
      const isMatch = await UserModel.comparePassword(user, password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Update last active timestamp
      await UserModel.update(user.id!, { lastActive: new Date() });

      // Generate tokens
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
        { expiresIn: '7d' }
      );

      // Remove sensitive data before sending response
      const { password: _, ...userData } = user;

      res.status(200).json({
        user: userData,
        token,
        refreshToken,
      });
    } catch (error) {
      console.error('Login error:', error);
      errorHandler(error, req, res);
    }
  }
);

// Refresh token route
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
    ) as { userId: number };

    // Generate new tokens
    const newToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    const newRefreshToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    errorHandler(error, req, res);
  }
});

export const authRoutes = router;
