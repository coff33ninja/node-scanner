import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { validateProfileUpdate, validatePasswordChange } from '../validators/user.validator';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const user = await User.findById(userId).select('-password -refreshTokens -twoFactorSecret');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const validationResult = validateProfileUpdate(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: validationResult.errors });
    }

    const userId = (req.user as any).id;
    const { name, email, preferences } = req.body;

    // Check email uniqueness if email is being updated
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(name && { name }),
          ...(email && { email }),
          ...(preferences && { preferences }),
          updatedAt: new Date()
        }
      },
      { new: true }
    ).select('-password -refreshTokens -twoFactorSecret');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const validationResult = validatePasswordChange(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: validationResult.errors });
    }

    const userId = (req.user as any).id;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    user.passwordChanged = true;
    await user.save();

    // Invalidate all refresh tokens
    user.refreshTokens = [];
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
};

export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({ message: 'Avatar URL is required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { avatarUrl } },
      { new: true }
    ).select('-password -refreshTokens -twoFactorSecret');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    logger.error('Update avatar error:', error);
    res.status(500).json({ message: 'Failed to update avatar' });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const { password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Perform soft delete or hard delete based on your requirements
    await User.findByIdAndUpdate(userId, {
      $set: {
        isActive: false,
        email: `deleted_${user.email}`,
        username: `deleted_${user.username}`,
        name: 'Deleted User'
      }
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    logger.error('Delete account error:', error);
    res.status(500).json({ message: 'Failed to delete account' });
  }
};

export const exportData = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const user = await User.findById(userId).select('-password -refreshTokens -twoFactorSecret');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch additional user-related data here
    const userData = {
      profile: user.toJSON(),
      // Add other user-related data here
      exportDate: new Date(),
    };

    res.json(userData);
  } catch (error) {
    logger.error('Export data error:', error);
    res.status(500).json({ message: 'Failed to export data' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const query: any = { isActive: true };
    if (search) {
      query.$or = [
        { username: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { name: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query)
      .select('username email name role lastActive avatarUrl')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
