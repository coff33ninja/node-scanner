import { useState } from 'react';
import { User } from './types';
import { AUTH_CONSTANTS } from './constants';

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return {
    currentUser,
    setCurrentUser,
    isFirstRun,
    setIsFirstRun,
    isLoading,
    setIsLoading,
    error,
    setError,
    ...AUTH_CONSTANTS
  };
};