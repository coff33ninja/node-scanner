import { Router } from 'express';
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

// Registration route
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Sign up user with Supabase Auth
    const { data: authData, error: signUpError } = await auth.signUp(email, password, { username });

    if (signUpError) {
      return res.status(400).json({ message: signUpError.message });
    }

    if (!authData.user) {
      return res.status(400).json({ message: 'Failed to create user' });
    }

    // Create user profile
    const { data: profile, error: profileError } = await db.createUserProfile(
      authData.user.id,
      username,
      email
    );

    if (profileError) {
      console.error('Failed to create user profile:', profileError);
      return res.status(500).json({ message: 'Failed to create user profile' });
    }

    res.status(201).json({
      user: profile,
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { data, error } = await auth.signIn(email, password);
    
    if (error) {
      return res.status(401).json({ message: error.message });
    }

    const profile = await db.getUserProfile(data.user.id);

    res.status(200).json({
      user: profile,
      session: data.session,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Logout route
router.post('/logout', async (req, res) => {
  try {
    const { error } = await auth.signOut();
    
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
});

export const authRoutes = router;