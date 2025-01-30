export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  lastActive?: string;
  avatarUrl?: string;
  passwordChanged?: boolean;
  twoFactorEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  lastLoginIp?: string;
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    language: string;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
  avatarUrl?: string;
  preferences?: User['preferences'];
}