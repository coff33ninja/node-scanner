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

// Request interceptor with better error handling
apiClient.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('api_key');
  const token = localStorage.getItem('token');
  
  // Add API key if available
  if (apiKey) {
    config.headers['X-API-Key'] = apiKey;
  }
  
  // Add JWT token if available
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Add timestamp to prevent caching
  config.params = {
    ...config.params,
    _t: Date.now()
  };
  
  return config;
}, (error) => {
  console.error('API Request Error:', error);
  return Promise.reject(error);
});

// Response interceptor with enhanced error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    console.error('API Response Error:', error);
    
    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      // Network errors
      if (!error.response) {
        toast({
          title: "Network Error",
          description: "Please check your internet connection",
          variant: "destructive",
        });
        return Promise.reject(error);
      }

      // Authentication errors
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('api_key');
        
        toast({
          title: "Authentication Error",
          description: "Please log in again",
          variant: "destructive",
        });
        
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Rate limiting errors
      if (error.response.status === 429) {
        toast({
          title: "Too Many Requests",
          description: "Please wait before trying again",
          variant: "destructive",
        });
        return Promise.reject(error);
      }

      // Server errors
      if (error.response.status >= 500) {
        toast({
          title: "Server Error",
          description: "An unexpected error occurred. Please try again later",
          variant: "destructive",
        });
        return Promise.reject(error);
      }

      // Other client errors
      const errorMessage = error.response.data?.message || 'An unexpected error occurred';
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

// Type-safe request methods
export const setApiKey = (apiKey: string): void => {
  localStorage.setItem('api_key', apiKey);
};

export const removeApiKey = (): void => {
  localStorage.removeItem('api_key');
};

// Retry logic for failed requests
export const retryRequest = async (
  requestFn: () => Promise<any>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<any> => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError;
};

export default apiClient;
