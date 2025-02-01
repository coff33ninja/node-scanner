import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth, db } from '../config/supabase.config';

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
];

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
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

      // Sign up user with Supabase Auth
      const authData = await auth.signUp(email, password, { username });

      try {
        // Create user profile
        const profile = await db.createUserProfile(
          authData.user.id,
          username,
          email
        );

        res.status(201).json({
          user: profile,
          message: 'Registration successful'
        });
      } catch (profileError) {
        // If profile creation fails, we should clean up the auth user
        // Note: This requires admin rights which we might not have in the client
        console.error('Failed to create user profile:', profileError);
        res.status(500).json({ message: 'Failed to create user profile' });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(error.status || 500).json({ 
        message: error.message || 'Server error during registration'
      });
    }
  }
);

// Login route
router.post('/login', async (req: Request<object, object, LoginRequestBody>, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const data = await auth.signIn(email, password);
    const profile = await db.getUserProfile(data.user.id);

    res.status(200).json({
      user: profile,
      session: data.session,
      message: 'Login successful'
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(error.status || 500).json({ 
      message: error.message || 'Server error during login'
    });
  }
});

// Logout route
router.post('/logout', async (req: Request, res: Response) => {
  try {
    await auth.signOut();
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(error.status || 500).json({ 
      message: error.message || 'Server error during logout'
    });
  }
});

// Check auth status route
router.get('/check-auth', async (req: Request, res: Response) => {
  try {
    const { session } = await auth.getSession();

    if (!session) {
      return res.json({ isAuthenticated: false });
    }

    const profile = await db.getUserProfile(session.user.id);

    res.json({
      isAuthenticated: true,
      user: profile,
      session
    });
  } catch (error: any) {
    console.error('Auth check error:', error);
    res.status(error.status || 500).json({ 
      message: error.message || 'Server error during auth check'
    });
  }
});

export const authRoutes = router;