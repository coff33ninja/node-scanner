import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useSessionManagement = () => {
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();

  const handleSessionTimeoutChange = (minutes: number) => {
    setSessionTimeout(minutes);
    localStorage.setItem('sessionTimeout', String(minutes));
    toast({
      title: 'Session Timeout Updated',
      description: `Session will timeout after ${minutes} minutes of inactivity`,
    });
  };

  const handleRememberMeChange = (enabled: boolean) => {
    setRememberMe(enabled);
    localStorage.setItem('rememberMe', String(enabled));
  };

  useEffect(() => {
    const savedTimeout = localStorage.getItem('sessionTimeout');
    if (savedTimeout) setSessionTimeout(Number(savedTimeout));

    const savedRememberMe = localStorage.getItem('rememberMe');
    if (savedRememberMe) setRememberMe(savedRememberMe === 'true');
  }, []);

  return {
    sessionTimeout,
    rememberMe,
    handleSessionTimeoutChange,
    handleRememberMeChange,
  };
};