import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NetworkDevice, ApiResponse } from '@/types/api';
import apiClient from '@/lib/api-client';
import { useToast } from '@/components/ui/use-toast';

export function useNetwork() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: devices = [], isLoading, error } = useQuery({
    queryKey: ['network-devices'],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<NetworkDevice[]>>('/scan-network');
      return response.data.data;
    },
  });

  const scanMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post<ApiResponse<NetworkDevice[]>>('/scan-network');
      return response.data.data;
    },
    onSuccess: (newDevices) => {
      queryClient.setQueryData(['network-devices'], newDevices);
      toast({
        title: 'Network Scan Complete',
        description: `Found ${newDevices.length} devices`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Scan Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const addDeviceMutation = useMutation({
    mutationFn: async (device: NetworkDevice) => {
      const response = await apiClient.post<ApiResponse<NetworkDevice>>('/devices', device);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-devices'] });
      toast({
        title: 'Device Added',
        description: 'Device has been added successfully',
      });
    },
  });

  return {
    devices,
    isLoading,
    error,
    scanNetwork: scanMutation.mutate,
    isScanning: scanMutation.isPending,
    addDevice: addDeviceMutation.mutate,
    isAdding: addDeviceMutation.isPending,
  };
}