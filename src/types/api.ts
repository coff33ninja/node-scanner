export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface NetworkDevice {
  id?: string;
  name: string;
  ip: string;
  mac?: string;
  status: 'online' | 'offline' | 'unknown';
  lastSeen?: string;
  type?: string;
  group?: string;
}

export interface ApiKey {
  id: number;
  key: string;
  name: string;
  userId: number;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
}