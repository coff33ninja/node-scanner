import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { validateRegistration, validateLogin } from '../validators/auth.validator';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email, name } = req.body;

    // Create a new user with admin role for testing
    const user = new User({
      username,
      password,
      email,
      name,
      role: 'admin',
      lastActive: new Date(),
      passwordChanged: false,
      preferences: {
        theme: 'system',
        notifications: true,
        language: 'en'
      }
    });

    await user.save();

    // Generate tokens with longer expiration
    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, {
      expiresIn: '30d' // Extended to 30 days
    });

    const refreshToken = jwt.sign({ id: user._id.toString() }, JWT_REFRESH_SECRET, {
      expiresIn: '60d' // Extended to 60 days
    });

    // Update last active timestamp
    user.lastActive = new Date();
    await user.save();

    // Return user data and tokens - same response format as login
    res.status(201).json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        lastActive: user.lastActive,
        avatarUrl: user.avatarUrl,
        preferences: user.preferences,
        passwordChanged: user.passwordChanged
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate input
    await Promise.all(validateLogin.map(validation => validation.run(req)));
    const errors = validationResult(req);

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockUntil.getTime() - Date.now()) / 1000 / 60);
      return res.status(423).json({
        message: `Account is locked. Try again in ${remainingTime} minutes`
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incrementLoginAttempts();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      return res.status(200).json({
        requiresTwoFactor: true,
        userId: user._id
      });
    }

    // Generate tokens
    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id.toString() }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Save refresh token
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Update user data
    user.lastActive = new Date();
    user.lastLoginIp = req.ip;
    await user.save();

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
        preferences: user.preferences
      },
      token,
      refreshToken
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// Ensure proper closure of the file
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validationResult = validateLogin(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: validationResult.errors });
    }

    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockUntil.getTime() - Date.now()) / 1000 / 60);
      return res.status(423).json({
        message: `Account is locked. Try again in ${remainingTime} minutes`
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incrementLoginAttempts();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      return res.status(200).json({
        requiresTwoFactor: true,
        userId: user._id
      });
    }

    // Generate tokens
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Save refresh token
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Update user data
    user.lastActive = new Date();
    user.lastLoginIp = req.ip;
    await user.save();

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
        preferences: user.preferences
      },
      token,
      refreshToken
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

export const enableTwoFactor = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `AltTab:${user.username}`
    });

    // Save secret
    user.twoFactorSecret = secret.base32;
    await user.save();

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url || '');

    res.json({
      success: true,
      qrCode,
      secret: secret.base32
    });
  } catch (error) {
    logger.error('2FA enable error:', error);
    res.status(500).json({ message: 'Failed to enable 2FA' });
  }
};

// ... (previous code remains the same until verifyTwoFactor) ...

export const verifyTwoFactor = async (req: Request, res: Response) => {
  try {
    const { userId, code } = req.body;
    const user = await User.findById(userId);

    if (!user || !user.twoFactorSecret) {
      return res.status(404).json({ message: 'User not found or 2FA not set up' });
    }

    // Verify the code
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1 // Allow 30 seconds window
    });

    if (!verified) {
      return res.status(401).json({ message: 'Invalid 2FA code' });
    }

    // If verifying during setup
    if (!user.twoFactorEnabled) {
      user.twoFactorEnabled = true;
      await user.save();
    }

    // Generate tokens
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      refreshToken
    });
  } catch (error) {
    logger.error('2FA verification error:', error);
    res.status(500).json({ message: 'Failed to verify 2FA code' });
  }
};

export const disableTwoFactor = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const { currentPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password before disabling 2FA
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    res.json({ success: true });
  } catch (error) {
    logger.error('2FA disable error:', error);
    res.status(500).json({ message: 'Failed to disable 2FA' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if refresh token exists and is valid
    const tokenDoc = user.refreshTokens.find(t => t.token === refreshToken);
    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    // Generate new tokens
    const newToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    const newRefreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Remove old refresh token and add new one
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
    user.refreshTokens.push({
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    await user.save();

    res.json({
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const refreshToken = req.body.refreshToken;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove refresh token
    if (refreshToken) {
      user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
      await user.save();
    }

    res.json({ success: true });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({ message: 'Logout failed' });
  }
};

export const validateSession = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update last active timestamp
    user.lastActive = new Date();
    await user.save();

    res.json({ valid: true });
  } catch (error) {
    logger.error('Session validation error:', error);
    res.status(500).json({ message: 'Session validation failed' });
  }
};

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Two-factor authentication has been disabled.'
    });
  } catch (error) {
    logger.error('2FA disable error:', error);
    res.status(500).json({ message: 'Failed to disable 2FA' });
  }
};

export const disableTwoFactor = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const { currentPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Verify password before disabling 2FA
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();
    res.json({ success: true, message: 'Two-factor authentication has been disabled.' });
  } catch (error) {
  logger.error('2FA disable error:', error);
  res.status(500).json({ message: 'Failed to disable 2FA' });
  }
};