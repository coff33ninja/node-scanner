import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User, UserModel } from '../models/user.model';
import { errorHandler } from '../middleware/errorHandler';
import * as argon2 from 'argon2';
import session from 'express-session';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';

const router = Router();

// Redis client setup
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  // Enable TLS if using Redis Cloud or similar services
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined
});

// Initialize Redis store
const RedisStore = connectRedis(session);

// Session configuration
router.use(session({
  store: new RedisStore({
    client: redis,
    prefix: 'alttab:sess:', // Prefix for session keys in Redis
  }),
  secret: process.env.SESSION_SECRET || 'your_session_secret_here',
  name: 'sessionId', // Custom cookie name
  resave: false,
  saveUninitialized: false,
  rolling: true, // Refresh session with each request
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

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
];

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

// Custom type for session data
declare module 'express-session' {
  interface SessionData {
    userId: number;
    username: string;
    email: string;
  }
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

      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Hash password
      const hashedPassword = await argon2.hash(password);

      // Create user
      const result = UserModel.create({
        username,
        email,
        password: hashedPassword,
      });

      const user = UserModel.findById(result.lastInsertRowid as number);
      if (!user) {
        throw new Error('Failed to create user');
      }

      // Set user session
      req.session.userId = user.id!;
      req.session.username = user.username;
      req.session.email = user.email;

      // Remove password from user object before sending response
      const { password: _, ...userData } = user;

      res.status(201).json({
        user: userData,
        message: 'Registration successful'
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
);

interface LoginRequestBody {
  email: string;
  password: string;
}

// Login route
router.post('/login', async (req: Request<object, object, LoginRequestBody>, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Set user session
    req.session.userId = user.id!;
    req.session.username = user.username;
    req.session.email = user.email;

    // Remove password from user object before sending response
    const { password: _, ...userData } = user;

    res.status(200).json({
      user: userData,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Logout route
router.post('/logout', (req: Request, res: Response) => {
  const sessionId = req.session.id;

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }

    // Explicitly delete session from Redis
    redis.del(`alttab:sess:${sessionId}`).catch(console.error);

    res.clearCookie('sessionId');
    res.json({ message: 'Logged out successfully' });
  });
});

// Check auth status route
router.get('/check-auth', (req: Request, res: Response) => {
  if (req.session?.userId) {
    res.json({
      isAuthenticated: true,
      user: {
        id: req.session.userId,
        username: req.session.username,
        email: req.session.email
      }
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Session cleanup on server shutdown
process.on('SIGTERM', () => {
  redis.quit();
});

process.on('SIGINT', () => {
  redis.quit();
});

export const authRoutes = router;
