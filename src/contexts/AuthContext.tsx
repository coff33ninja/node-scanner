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

// Constants for authentication
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
        if (token) {
          const isValid = await validateSession();
          if (isValid) {
            await refreshToken();
            const response = await fetch(API_ENDPOINTS.VALIDATE_SESSION, {
              headers: getAuthHeaders(),
            });
            if (response.ok) {
              const userData = await response.json();
              setCurrentUser(userData.user);
            }
          } else {
            await logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError('Failed to initialize authentication');
      } finally {
        setIsLoading(false);
        setIsFirstRun(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      const resetTimer = () => {
        if (sessionTimer) {
          clearTimeout(sessionTimer);
        }
        const timer = setTimeout(() => {
          logout();
        }, SESSION_TIMEOUT);
        setSessionTimer(timer);
      };

      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keypress', resetTimer);

      resetTimer();

      return () => {
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('keypress', resetTimer);
        if (sessionTimer) {
          clearTimeout(sessionTimer);
        }
      };
    }
  }, [currentUser, sessionTimer]);

  const register = async (data: {
    username: string;
    password: string;
    email: string;
    name: string;
    language?: string;
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const { token, refreshToken, user } = await response.json();
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    username: string,
    password: string,
    remember: boolean = false
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const { token, refreshToken, user } = await response.json();
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(TOKEN_KEY, token);
      storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      setCurrentUser(user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch(API_ENDPOINTS.LOGOUT, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(REFRESH_TOKEN_KEY);
      setCurrentUser(null);
      if (sessionTimer) {
        clearTimeout(sessionTimer);
      }
    }
  };

  const validateSession = async (): Promise<boolean> => {
    try {
      const response = await fetch(API_ENDPOINTS.VALIDATE_SESSION, {
        headers: getAuthHeaders(),
      });
      return response.ok;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) return false;

      const response = await fetch(API_ENDPOINTS.REFRESH_TOKEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
      });

      if (response.ok) {
        const { token } = await response.json();
        const storage = localStorage.getItem(REFRESH_TOKEN_KEY) ? localStorage : sessionStorage;
        storage.setItem(TOKEN_KEY, token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  const value = {
    currentUser,
    isFirstRun,
    isLoading,
    error,
    register,
    login,
    logout,
    updateProfile: async () => false, // Implement these methods as needed
    changePassword: async () => false,
    enableTwoFactor: async () => ({ success: false }),
    disableTwoFactor: async () => false,
    verifyTwoFactor: async () => false,
    validateSession,
    refreshToken,
    deleteAccount: async () => false,
    exportData: async () => null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};