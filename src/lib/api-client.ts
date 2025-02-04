import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { ApiError } from '@/types/api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const apiKey = localStorage.getItem('api_key');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (apiKey) {
      config.headers['X-API-Key'] = apiKey;
    }

    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    console.error('API Response Error:', error);
    
    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      
      // Network errors
      if (!axiosError.response) {
        toast({
          title: "Network Error",
          description: "Please check your internet connection",
          variant: "destructive",
        });
        return Promise.reject(axiosError);
      }

      // Authentication errors
      if (axiosError.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('api_key');
        
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        });
        
        window.location.href = '/login';
        return Promise.reject(axiosError);
      }

      // Rate limiting errors
      if (axiosError.response.status === 429) {
        toast({
          title: "Too Many Requests",
          description: "Please wait before trying again",
          variant: "destructive",
        });
        return Promise.reject(axiosError);
      }

      // Server errors
      if (axiosError.response.status >= 500) {
        toast({
          title: "Server Error",
          description: "An unexpected error occurred. Please try again later",
          variant: "destructive",
        });
        return Promise.reject(axiosError);
      }

      // Other client errors
      const errorMessage = axiosError.response.data?.message || 'An unexpected error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } else if (error instanceof Error) {
      // Handle standard Error objects
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Handle unknown errors
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;