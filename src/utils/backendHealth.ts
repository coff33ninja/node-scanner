import { API_ENDPOINTS } from '@/config/api';

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export const FIRST_RUN_CREDENTIALS = {
  username: 'admin',
  password: 'abcd1234!',
  isFirstRun: true,
};