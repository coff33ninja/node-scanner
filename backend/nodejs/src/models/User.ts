import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  lastActive: Date;
  avatarUrl?: string;
  passwordChanged: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  lastLoginIp?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
  refreshTokens: Array<{
    token: string;
    expiresAt: Date;
  }>;
  loginAttempts: number;
  lockUntil?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    // Removing minlength restriction
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'moderator'],
    default: 'user'
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  avatarUrl: String,
  passwordChanged: {
    type: Boolean,
    default: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginIp: String,
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  refreshTokens: [{
    token: String,
    expiresAt: Date
  }],
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date
}, {
  timestamps: true
});

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Method to increment login attempts
UserSchema.methods.incrementLoginAttempts = async function() {
  // Lock account if max attempts reached
  if (this.loginAttempts + 1 >= 5) {
    this.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
  }
  this.loginAttempts += 1;
  await this.save();
};

// Method to reset login attempts
UserSchema.methods.resetLoginAttempts = async function() {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};

// Check if the model exists before compiling it
export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// Type for Request.user
declare global {
  namespace Express {
    interface User extends IUser {}
  }
}