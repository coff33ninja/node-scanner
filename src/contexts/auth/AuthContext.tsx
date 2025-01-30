import { createContext } from 'react';
import { User } from './types';

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);