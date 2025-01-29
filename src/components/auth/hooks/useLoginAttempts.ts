import { useState, useEffect } from 'react';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

interface LoginAttempts {
  count: number;
  timestamp: number;
}

export const useLoginAttempts = () => {
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempts>(() => {
    const stored = localStorage.getItem('loginAttempts');
    return stored ? JSON.parse(stored) : { count: 0, timestamp: 0 };
  });

  useEffect(() => {
    localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
  }, [loginAttempts]);

  const isAccountLocked = () => {
    if (loginAttempts.count >= MAX_LOGIN_ATTEMPTS) {
      const timeElapsed = Date.now() - loginAttempts.timestamp;
      if (timeElapsed < LOCKOUT_TIME) {
        return true;
      } else {
        setLoginAttempts({ count: 0, timestamp: 0 });
        return false;
      }
    }
    return false;
  };

  const getRemainingLockoutTime = () => {
    const timeElapsed = Date.now() - loginAttempts.timestamp;
    return Math.ceil((LOCKOUT_TIME - timeElapsed) / 1000 / 60);
  };

  const incrementAttempts = () => {
    setLoginAttempts({
      count: loginAttempts.count + 1,
      timestamp: Date.now(),
    });
  };

  const resetAttempts = () => {
    setLoginAttempts({ count: 0, timestamp: 0 });
  };

  return {
    isAccountLocked,
    getRemainingLockoutTime,
    incrementAttempts,
    resetAttempts,
    attemptsRemaining: MAX_LOGIN_ATTEMPTS - loginAttempts.count,
  };
};