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

export interface AuthContextType {
  currentUser: User | null;
  isFirstRun: boolean;
  isLoading: boolean;
  error: string | null;
  register: (data: {
    username: string;
    password: string;
    email: string;
    name: string;
    language?: string;
  }) => Promise<boolean>;
  login: (
    username: string,
    password: string,
    remember?: boolean
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    name?: string;
    email?: string;
    avatarUrl?: string;
    preferences?: User['preferences'];
  }) => Promise<boolean>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  enableTwoFactor: () => Promise<{ success: boolean; qrCode?: string }>;
  disableTwoFactor: () => Promise<boolean>;
  verifyTwoFactor: (code: string) => Promise<boolean>;
  validateSession: () => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  deleteAccount: (password: string) => Promise<boolean>;
  exportData: () => Promise<any>;
}