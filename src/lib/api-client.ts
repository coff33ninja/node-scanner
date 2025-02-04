import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('api_key');
  if (apiKey) {
    config.headers['X-API-Key'] = apiKey;
  }
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('api_key');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });

    return Promise.reject(error);
  }
);

export const setApiKey = (apiKey: string) => {
  localStorage.setItem('api_key', apiKey);
};

export const removeApiKey = () => {
  localStorage.removeItem('api_key');
};

export default apiClient;