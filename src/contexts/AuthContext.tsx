import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  lastActive: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: { username: string; password: string; email: string; name: string; }) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Get users from storage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.username === username && u.password === password);
      
      if (user) {
        // Remove password from user object before storing in state
        const { password: _, ...safeUser } = user;
        setUser(safeUser);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(safeUser));
        
        // Update last active
        const updatedUsers = users.map((u: any) => {
          if (u.username === username) {
            return { ...u, lastActive: new Date().toISOString() };
          }
          return u;
        });
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const register = async (userData: { username: string; password: string; email: string; name: string; }): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if username already exists
      if (users.some((u: any) => u.username === userData.username)) {
        return false;
      }

      const newUser = {
        id: crypto.randomUUID(),
        ...userData,
        role: users.length === 0 ? 'admin' : 'user', // First user is admin
        lastActive: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Auto login after registration
      const { password: _, ...safeUser } = newUser;
      setUser(safeUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(safeUser));

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update user in users list
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: any) => {
      if (u.id === user.id) {
        return { ...u, ...userData };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};