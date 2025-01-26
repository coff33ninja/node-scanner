import React, { createContext, useContext, useState, useEffect } from 'react';
import bcryptjs from 'bcryptjs';

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  lastActive: string;
}

interface AuthContextType {
  currentUser: User | null;
  isFirstRun: boolean;
  register: (data: { username: string; password: string; email: string; name: string; }) => Promise<boolean>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: { name?: string; email?: string; }) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFirstRun, setIsFirstRun] = useState<boolean>(true);

  useEffect(() => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    setIsFirstRun(users.length === 0);
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const register = async (data: { username: string; password: string; email: string; name: string; }) => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some((u: User) => u.username === data.username)) {
      return false;
    }

    const hashedPassword = await bcryptjs.hash(data.password, 10);
    
    const newUser: User = {
      id: crypto.randomUUID(),
      username: data.username,
      passwordHash: hashedPassword,
      email: data.email,
      name: data.name,
      role: users.length === 0 ? 'admin' : 'user',
      lastActive: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const { passwordHash, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

    return true;
  };

  const login = async (username: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.username === username);

    if (!user) return false;

    const isValid = await bcryptjs.compare(password, user.passwordHash);
    if (!isValid) return false;

    user.lastActive = new Date().toISOString();
    localStorage.setItem('users', JSON.stringify(users));

    const { passwordHash, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = async (data: { name?: string; email?: string; }) => {
    if (!currentUser) return false;

    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === currentUser.id);

    if (userIndex === -1) return false;

    const updatedUser: User = {
      ...users[userIndex],
      ...data,
      lastActive: new Date().toISOString()
    };

    users[userIndex] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));

    const { passwordHash, ...userWithoutPassword } = updatedUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

    return true;
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!currentUser) return false;

    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.id === currentUser.id);

    if (!user) return false;

    const isValid = await bcryptjs.compare(currentPassword, user.passwordHash);
    if (!isValid) return false;

    const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
    user.passwordHash = hashedNewPassword;
    user.lastActive = new Date().toISOString();

    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  const value = {
    currentUser,
    isFirstRun,
    register,
    login,
    logout,
    updateProfile,
    changePassword
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