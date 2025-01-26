import React, { createContext, useContext, useState, useEffect } from 'react';
import bcryptjs from 'bcryptjs';
import { databaseService, DBUser } from '../services/DatabaseService';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  lastActive: string;
  avatarUrl?: string;
  passwordChanged?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  isFirstRun: boolean;
  register: (data: { username: string; password: string; email: string; name: string; }) => Promise<boolean>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: { name?: string; email?: string; }) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  exportData: () => Promise<any | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFirstRun, setIsFirstRun] = useState<boolean>(true);

  useEffect(() => {
    const initDB = async () => {
      await databaseService.init();
      const users = await databaseService.getAllUsers();
      setIsFirstRun(users.length === 0);
      
      // Add default admin account if no users exist
      if (users.length === 0) {
        const hashedPassword = await bcryptjs.hash('abc123', 10);
        const defaultAdmin: DBUser = {
          id: crypto.randomUUID(),
          username: 'AltTab',
          passwordHash: hashedPassword,
          email: 'admin@upsnap.local',
          name: 'Default Admin',
          role: 'admin',
          lastActive: new Date().toISOString(),
          passwordChanged: false
        };
        await databaseService.addUser(defaultAdmin);
      }

      // Check for existing session
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        const dbUser = await databaseService.getUserByUsername(user.username);
        if (dbUser) {
          setCurrentUser(user);
        } else {
          localStorage.removeItem('currentUser');
        }
      }
    };
    
    initDB();
  }, []);

  const register = async (data: { username: string; password: string; email: string; name: string; }) => {
    try {
      const hashedPassword = await bcryptjs.hash(data.password, 10);
      
      const newUser: DBUser = {
        id: crypto.randomUUID(),
        username: data.username,
        passwordHash: hashedPassword,
        email: data.email,
        name: data.name,
        role: isFirstRun ? 'admin' : 'user',
        lastActive: new Date().toISOString(),
        passwordChanged: true
      };

      const success = await databaseService.addUser(newUser);
      if (success) {
        const { passwordHash, ...userWithoutPassword } = newUser;
        setCurrentUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        setIsFirstRun(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const user = await databaseService.getUserByUsername(username);
      if (!user) return false;

      const isValid = await bcryptjs.compare(password, user.passwordHash);
      if (!isValid) return false;

      const updatedUser = {
        ...user,
        lastActive: new Date().toISOString()
      };
      
      await databaseService.updateUser(updatedUser);

      const { passwordHash, ...userWithoutPassword } = updatedUser;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = async (data: { name?: string; email?: string; }) => {
    if (!currentUser) return false;

    try {
      const success = await databaseService.updateUser({
        id: currentUser.id,
        ...data,
        lastActive: new Date().toISOString()
      });

      if (success) {
        const updatedUser = { ...currentUser, ...data };
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!currentUser) return false;

    try {
      const user = await databaseService.getUserByUsername(currentUser.username);
      if (!user) return false;

      const isValid = await bcryptjs.compare(currentPassword, user.passwordHash);
      if (!isValid) return false;

      const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
      const success = await databaseService.updateUser({
        id: currentUser.id,
        passwordHash: hashedNewPassword,
        lastActive: new Date().toISOString(),
        passwordChanged: true
      });

      return success;
    } catch (error) {
      console.error('Change password error:', error);
      return false;
    }
  };

  const deleteAccount = async () => {
    if (!currentUser) return false;
    const success = await databaseService.deleteUser(currentUser.id);
    if (success) {
      logout();
      return true;
    }
    return false;
  };

  const exportData = async () => {
    if (!currentUser) return null;
    const userData = await databaseService.getUserData(currentUser.id);
    const devices = await databaseService.getUserDevices(currentUser.id);
    return {
      userData,
      devices
    };
  };

  const value = {
    currentUser,
    isFirstRun,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
    exportData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
