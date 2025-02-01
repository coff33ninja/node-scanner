import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NetworkDevice, scanNetwork, ScanOptions } from '@/utils/networkUtils';
import { useToast } from '@/hooks/use-toast';

export const useNetworkScanner = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: devices, isLoading } = useQuery({
    queryKey: ['network-devices'],
    queryFn: async () => {
      const options: ScanOptions = {
        ipRange: '192.168.1.0/24', // Default range
        timeout: 1000,
        ports: [22, 80, 443, 3389, 5900] // Common ports to scan
      };
      return scanNetwork(options);
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const scanMutation = useMutation({
    mutationFn: scanNetwork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-devices'] });
      toast({
        title: "Network Scan Complete",
        description: "Device list has been updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Scan Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    devices: devices || [],
    isLoading,
    scanNetwork: (options: ScanOptions) => scanMutation.mutate(options),
    isScanning: scanMutation.isPending
  };
};