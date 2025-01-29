import { useState, useEffect } from 'react';
import { User } from './types';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentUser) {
      const resetTimer = () => {
        if (sessionTimer) {
          clearTimeout(sessionTimer);
        }
        const timer = setTimeout(() => {
          // Implement logout logic here
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

  return {
    currentUser,
    setCurrentUser,
    isFirstRun,
    setIsFirstRun,
    isLoading,
    setIsLoading,
    error,
    setError,
    sessionTimer,
    setSessionTimer,
    TOKEN_KEY,
    REFRESH_TOKEN_KEY,
  };
};