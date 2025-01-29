import { User } from '../contexts/auth/types';

export interface AuthState {
  currentUser: User | null;
  isFirstRun: boolean;
  isLoading: boolean;
  error: string | null;
  sessionTimer: NodeJS.Timeout | null;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number;
  rememberMe: boolean;
  privacySettings: PrivacySettings;
}

export interface PrivacySettings {
  activityTracking: boolean;
  marketingCommunications: boolean;
}