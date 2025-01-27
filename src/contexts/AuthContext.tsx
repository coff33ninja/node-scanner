import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS, getAuthHeaders } from '@/config/api';

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

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('[AuthProvider] Initializing AuthProvider');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);

  // Register implementation
  const register = async (data: {
    username: string;
    password: string;
    email: string;
    name: string;
    language?: string;
  }): Promise<boolean> => {
    console.log('[AuthProvider] Attempting registration');
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const result = await response.json();
      if (result.token) {
        localStorage.setItem('auth_token', result.token);
        setCurrentUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[AuthProvider] Registration error:', error);
      setError('Registration failed');
      return false;
    }
  };

  // Login implementation
  const login = async (
    username: string,
    password: string,
    remember: boolean = false
  ): Promise<boolean> => {
    console.log('[AuthProvider] Attempting login');
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      if (result.token) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('auth_token', result.token);
        setCurrentUser(result.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[AuthProvider] Login error:', error);
      setError('Login failed');
      return false;
    }
  };

  // Logout implementation
  const logout = async (): Promise<void> => {
    console.log('[AuthProvider] Logging out');
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    setCurrentUser(null);
  };

  // Session validation
  const validateSession = async (): Promise<boolean> => {
    console.log('[AuthProvider] Validating session');
    try {
      const response = await fetch(API_ENDPOINTS.VALIDATE_SESSION, {
        headers: getAuthHeaders(),
      });
      return response.ok;
    } catch (error) {
      console.error('[AuthProvider] Session validation error:', error);
      return false;
    }
  };

  // Token refresh
  const refreshToken = async (): Promise<boolean> => {
    console.log('[AuthProvider] Refreshing token');
    try {
      const response = await fetch(API_ENDPOINTS.REFRESH_TOKEN, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('auth_token', token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[AuthProvider] Token refresh error:', error);
      return false;
    }
  };

  // Initial auth check effect
  useEffect(() => {
    console.log('[AuthProvider] Running initial auth check');
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        console.log('[AuthProvider] Found token:', !!token);
        
        if (token) {
          const isValid = await validateSession();
          console.log('[AuthProvider] Token validation result:', isValid);
          
          if (isValid) {
            await refreshToken();
            const response = await fetch(API_ENDPOINTS.VALIDATE_SESSION, {
              headers: getAuthHeaders(),
            });
            if (response.ok) {
              const userData = await response.json();
              console.log('[AuthProvider] User data retrieved successfully');
              setCurrentUser(userData.user);
            }
          } else {
            console.log('[AuthProvider] Invalid session, logging out');
            await logout();
          }
        }
      } catch (error) {
        console.error('[AuthProvider] Auth initialization error:', error);
        setError('Failed to initialize authentication');
      } finally {
        console.log('[AuthProvider] Auth initialization complete');
        setIsLoading(false);
        setIsFirstRun(false);
      }
    };

    initAuth();
  }, []);

  // Session timer effect
  useEffect(() => {
    console.log('[AuthProvider] Session timer effect running', {
      hasUser: !!currentUser,
      userRole: currentUser?.role
    });

    if (currentUser && currentUser.role !== 'admin') {
      const resetTimer = () => {
        if (sessionTimer) {
          clearTimeout(sessionTimer);
        }
        const timer = setTimeout(() => {
          console.log('[AuthProvider] Session timeout, logging out');
          logout();
        }, 30 * 60 * 1000); // 30 minutes
        setSessionTimer(timer);
      };

      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keypress', resetTimer);

      resetTimer();

      return () => {
        console.log('[AuthProvider] Cleaning up session timer');
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('keypress', resetTimer);
        if (sessionTimer) {
          clearTimeout(sessionTimer);
        }
      };
    }
  }, [currentUser, sessionTimer]);

  // Stub implementations for other methods
  const updateProfile = async () => false;
  const changePassword = async () => false;
  const enableTwoFactor = async () => ({ success: false });
  const disableTwoFactor = async () => false;
  const verifyTwoFactor = async () => false;
  const deleteAccount = async () => false;
  const exportData = async () => null;

  const value = {
    currentUser,
    isFirstRun,
    isLoading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    enableTwoFactor,
    disableTwoFactor,
    verifyTwoFactor,
    validateSession,
    refreshToken,
    deleteAccount,
    exportData,
  };

  console.log('[AuthProvider] Current state:', {
    isLoading,
    isFirstRun,
    hasUser: !!currentUser,
    hasError: !!error
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};