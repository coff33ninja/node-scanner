import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/user.model';
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
}

// Registration route
router.post('/register', registerValidation, async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Username or email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      name,
      preferences: {
        language: req.body.language || 'en',
        theme: 'system',
        notifications: true
      }
    });

    // Generate tokens
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
      { expiresIn: '7d' }
    );

    // Return user data and tokens
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      lastActive: user.lastActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isActive: user.isActive,
      preferences: user.preferences
    };

    res.status(201).json({
      user: userData,
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login route (placeholder for now)
router.post('/login', (req: Request, res: Response) => {
  res.status(501).json({ message: 'Not implemented' });
});

export const authRoutes = router;