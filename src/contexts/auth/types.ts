export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  lastActive: string;
  avatarUrl?: string;
  passwordChanged?: boolean;
  twoFactorEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lastLoginIp?: string;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  name: string;
  language?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  avatarUrl?: string;
  preferences?: User['preferences'];
}