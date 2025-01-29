import { useState } from 'react';
import { API_ENDPOINTS, getAuthHeaders } from '@/config/api';
import { User, RegisterData, UpdateProfileData } from './types';

export const useAuthActions = (
  setCurrentUser: (user: User | null) => void,
  setError: (error: string | null) => void,
  setIsLoading: (loading: boolean) => void
) => {
  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const { user } = await response.json();
      setCurrentUser(user);
      return true;
    } catch (error) {
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
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { user } = await response.json();
      setCurrentUser(user);
      return true;
    } catch (error) {
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
      });
    } finally {
      setCurrentUser(null);
    }
  };

  return {
    register,
    login,
    logout,
  };
};