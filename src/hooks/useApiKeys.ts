import { useState } from 'react';
import apiClient from '@/lib/api-client';
import { useToast } from '@/components/ui/use-toast';
import { ApiKey } from '@/types/api';

export const useApiKeys = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateApiKey = async (name: string = 'Default Key'): Promise<ApiKey | null> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<ApiKey>('/api/keys/generate', { name });
      toast({
        title: 'Success',
        description: 'New API key generated successfully',
      });
      return response.data;
    } catch (error) {
      console.error('Error generating API key:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const revokeApiKey = async (keyId: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      await apiClient.delete(`/api/keys/${keyId}`);
      toast({
        title: 'Success',
        description: 'API key revoked successfully',
      });
      return true;
    } catch (error) {
      console.error('Error revoking API key:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateApiKey,
    revokeApiKey,
    isLoading
  };
};