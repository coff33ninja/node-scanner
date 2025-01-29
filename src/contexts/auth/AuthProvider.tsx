import React, { useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useAuthState } from './useAuthState';
import { API_ENDPOINTS, getAuthHeaders } from '@/config/api';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentUser,
    setCurrentUser,
    isFirstRun,
    setIsFirstRun,
    isLoading,
    setIsLoading,
    error,
    setError,
    TOKEN_KEY,
    REFRESH_TOKEN_KEY,
  } = useAuthState();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
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
      if (remember) {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      } else {
        sessionStorage.setItem(TOKEN_KEY, token);
        sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
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
