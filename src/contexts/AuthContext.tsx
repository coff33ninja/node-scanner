import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          const isValid = await validateSession();
          if (isValid) {
            await refreshToken();
            // Fetch and set user data
            const userData = await fetchUserData();
            setCurrentUser(userData);
          } else {
            // Clear invalid session
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

  // Session management
  useEffect(() => {
    if (currentUser) {
      // Reset session timer on user activity
      const resetTimer = () => {
        if (sessionTimer) {
          clearTimeout(sessionTimer);
        }
        const timer = setTimeout(() => {
          logout();
        }, SESSION_TIMEOUT);
        setSessionTimer(timer);
      };

      // Add activity listeners
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keypress', resetTimer);

      // Initial timer
      resetTimer();

      // Cleanup
      return () => {
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('keypress', resetTimer);
        if (sessionTimer) {
          clearTimeout(sessionTimer);
        }
      };
    }
  }, [currentUser, sessionTimer]);

  const fetchUserData = async (): Promise<User> => {
    const response = await fetch('/api/user/profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch user data');
    return response.json();
  };

  const register = async (data: {
    username: string;
    password: string;
    email: string;
    name: string;
    language?: string;
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const { token, refreshToken, user } = await response.json();
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        setCurrentUser(user);
        return true;
      }
      return false;
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const { token, refreshToken, user } = await response.json();
        if (remember) {
          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        } else {
          sessionStorage.setItem(TOKEN_KEY, token);
          sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        }
        setCurrentUser(user);
        return true;
      }
      return false;
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
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        }
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

  const updateProfile = async (data: {
    name?: string;
    email?: string;
    avatarUrl?: string;
    preferences?: User['preferences'];
  }): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setCurrentUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      return response.ok;
    } catch (error) {
      console.error('Password change error:', error);
      setError('Failed to change password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const enableTwoFactor = async (): Promise<{ success: boolean; qrCode?: string }> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(prev => prev ? { ...prev, twoFactorEnabled: true } : null);
        return { success: true, qrCode: data.qrCode };
      }
      return { success: false };
    } catch (error) {
      console.error('2FA enable error:', error);
      setError('Failed to enable 2FA');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const disableTwoFactor = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        }
      });

      if (response.ok) {
        setCurrentUser(prev => prev ? { ...prev, twoFactorEnabled: false } : null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('2FA disable error:', error);
      setError('Failed to disable 2FA');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTwoFactor = async (code: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        },
        body: JSON.stringify({ code })
      });

      return response.ok;
    } catch (error) {
      console.error('2FA verification error:', error);
      setError('Failed to verify 2FA code');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const validateSession = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) return false;

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem(TOKEN_KEY, token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  const deleteAccount = async (password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        await logout();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Account deletion error:', error);
      setError('Failed to delete account');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async (): Promise<any> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/user/export', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
        }
      });

      if (response.ok) {
        return response.json();
      }
      return null;
    } catch (error) {
      console.error('Data export error:', error);
      setError('Failed to export data');
      return null;
    } finally {
      setIsLoading(false);
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
    updateProfile,
    changePassword,
    enableTwoFactor,
    disableTwoFactor,
    verifyTwoFactor,
    validateSession,
    refreshToken,
    deleteAccount,
    exportData
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
