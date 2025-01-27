const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  VALIDATE_SESSION: `${API_BASE_URL}/auth/validate`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Network endpoints
  NETWORK_SCAN: `${API_BASE_URL}/network/scan`,
  NETWORK_WAKE: `${API_BASE_URL}/network/wake`,
  NETWORK_SHUTDOWN: `${API_BASE_URL}/network/shutdown`,
  
  // User management endpoints
  USERS: `${API_BASE_URL}/users`,
  USER_PROFILE: `${API_BASE_URL}/users/profile`,
  USER_SETTINGS: `${API_BASE_URL}/users/settings`,
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};