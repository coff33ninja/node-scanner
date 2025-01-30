import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Device {
  id: string;
  name: string;
  macAddress: string;
  ipAddress?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useDevices = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: devices, isLoading, error } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('devices')
        .select('*');
      
      if (error) throw error;
      
      return (data as any[]).map(device => ({
        id: device.id,
        name: device.name,
        macAddress: device.mac_address,
        ipAddress: device.ip_address,
        userId: device.user_id,
        createdAt: device.created_at,
        updatedAt: device.updated_at
      })) as Device[];
    },
  });

  const addDevice = useMutation({
    mutationFn: async (device: Omit<Device, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      
      if (!userId) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('devices')
        .insert([{
          name: device.name,
          mac_address: device.macAddress,
          ip_address: device.ipAddress,
          user_id: userId
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast({
        title: "Success",
        description: "Device added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateDevice = useMutation({
    mutationFn: async (device: Partial<Device> & { id: string }) => {
      const { data, error } = await supabase
        .from('devices')
        .update({
          name: device.name,
          mac_address: device.macAddress,
          ip_address: device.ipAddress,
        })
        .eq('id', device.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast({
        title: "Success",
        description: "Device updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteDevice = useMutation({
    mutationFn: async (deviceId: string) => {
      const { error } = await supabase
        .from('devices')
        .delete()
        .eq('id', deviceId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      toast({
        title: "Success",
        description: "Device deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    devices,
    isLoading,
    error,
    addDevice,
    updateDevice,
    deleteDevice,
  };
};