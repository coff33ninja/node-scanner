import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';
import { useToast } from '@/hooks/use-toast';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userData) {
          const rawPreferences = userData.preferences as { [key: string]: any } | null;
          const defaultPreferences = {
            theme: 'system' as const,
            notifications: true,
            language: 'en'
          };

          const preferences = {
            theme: (rawPreferences?.theme || defaultPreferences.theme) as 'light' | 'dark' | 'system',
            notifications: Boolean(rawPreferences?.notifications ?? defaultPreferences.notifications),
            language: String(rawPreferences?.language || defaultPreferences.language)
          };

          setCurrentUser({
            id: userData.id,
            username: userData.username,
            email: userData.email,
            name: userData.name || userData.username, // Fallback to username if name is not set
            role: userData.role as 'admin' | 'user' | 'moderator',
            lastActive: userData.last_active,
            avatarUrl: userData.avatar_url,
            passwordChanged: userData.password_changed,
            twoFactorEnabled: userData.two_factor_enabled,
            createdAt: userData.created_at,
            updatedAt: userData.updated_at,
            isActive: userData.is_active,
            lastLoginIp: userData.last_login_ip,
            preferences
          });
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', currentUser?.id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isLoading,
      error,
      login,
      logout,
      register,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};