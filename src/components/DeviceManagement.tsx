import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { NetworkDevice } from '@/utils/networkUtils';
import { Server, Power, Settings, AlertCircle } from 'lucide-react';

interface DeviceManagementProps {
  device: NetworkDevice;
  onWake?: () => void;
  onShutdown?: () => void;
}

export const DeviceManagement = ({ device, onWake, onShutdown }: DeviceManagementProps) => {
  const { toast } = useToast();

  const handleWake = async () => {
    try {
      await onWake?.();
      toast({
        title: "Wake-on-LAN",
        description: `Wake signal sent to ${device.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to wake device",
        variant: "destructive",
      });
    }
  };

  const handleShutdown = async () => {
    try {
      await onShutdown?.();
      toast({
        title: "Shutdown",
        description: `Shutdown signal sent to ${device.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to shutdown device",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Server className="h-5 w-5" />
          <h3 className="text-lg font-semibold">{device.name}</h3>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleWake}
            disabled={device.status === 'online'}
          >
            <Power className="h-4 w-4 mr-2" />
            Wake
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShutdown}
            disabled={device.status === 'offline'}
          >
            <Power className="h-4 w-4 mr-2" />
            Shutdown
          </Button>
        </div>
      </div>
    </Card>
  );
};