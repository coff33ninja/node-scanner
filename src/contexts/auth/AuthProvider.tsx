import React, { useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { API_ENDPOINTS, getAuthHeaders } from '@/config/api';
import { AUTH_CONSTANTS } from './constants';

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
  } = useAuthState();

  const { register, login, logout } = useAuthActions(setCurrentUser, setError, setIsLoading);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem(AUTH_CONSTANTS.TOKEN_KEY);
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
      const refreshToken = localStorage.getItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY) || 
                          sessionStorage.getItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY);
      if (!refreshToken) return false;

      const response = await fetch(API_ENDPOINTS.REFRESH_TOKEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        credentials: 'include',
      });

      if (response.ok) {
        const { token } = await response.json();
        const storage = localStorage.getItem(AUTH_CONSTANTS.REFRESH_TOKEN_KEY) ? 
                       localStorage : sessionStorage;
        storage.setItem(AUTH_CONSTANTS.TOKEN_KEY, token);
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
    validateSession,
    refreshToken,
    updateProfile: async () => false,
    changePassword: async () => false,
    enableTwoFactor: async () => ({ success: false }),
    disableTwoFactor: async () => false,
    verifyTwoFactor: async () => false,
    deleteAccount: async () => false,
    exportData: async () => null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};