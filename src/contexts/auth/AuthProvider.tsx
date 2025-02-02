import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { User } from './types';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Setting up auth state change listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      setIsLoading(true);
      
      if (session) {
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userError) {
            console.error('Error fetching user data:', userError);
            setCurrentUser(null);
            setError('Error fetching user data');
          } else if (userData) {
            console.log('User data fetched:', userData);
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
              name: userData.username,
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
            
            console.log('Navigating to home after setting user');
            navigate('/');
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setError('Error processing authentication');
        }
      } else {
        console.log('No session, clearing user');
        setCurrentUser(null);
        if (window.location.pathname !== '/login') {
          navigate('/login');
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting login with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email,
        password 
      });
      
      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        console.log('Login successful:', data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { username: string, password: string, email: string, name: string }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            name: data.name,
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

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Password change error:', error);
      return false;
    }
  };

  const deleteAccount = async () => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(currentUser?.id as string);
      if (error) throw error;
    } catch (error) {
      console.error('Account deletion error:', error);
      throw error;
    }
  };

  const exportData = async () => {
    // Implementation pending
    console.log('Export data not implemented yet');
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast({
          title: "Logout Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        navigate('/login');
      }
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
      isFirstRun,
      error,
      login,
      logout,
      register,
      updateProfile,
      changePassword,
      deleteAccount,
      exportData,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
