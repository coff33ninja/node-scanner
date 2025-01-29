import { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { NetworkDevice } from "@/utils/networkUtils";
import { Card } from "@/components/ui/card";
import { Wifi, Plus } from "lucide-react";

interface NetworkDeviceListProps {
  devices: NetworkDevice[];
  onAddDevice: (device: NetworkDevice) => void;
}

export const NetworkDeviceList = ({ devices, onAddDevice }: NetworkDeviceListProps) => {
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  const { toast } = useToast();

  const handleAddDevice = (device: NetworkDevice) => {
    try {
      onAddDevice(device);
      toast({
        title: "Device Added",
        description: `${device.name || device.ip} has been added to your devices.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add device.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Wifi className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Discovered Devices</h3>
      </div>
      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-4">
          {devices.map((device) => (
            <div
              key={device.ip}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                selectedDevice?.ip === device.ip ? 'bg-accent' : 'hover:bg-accent/50'
              } transition-colors cursor-pointer`}
              onClick={() => setSelectedDevice(device)}
            >
              <div>
                <p className="font-medium">{device.name || `Device (${device.ip})`}</p>
                <p className="text-sm text-muted-foreground">IP: {device.ip}</p>
                <p className="text-sm text-muted-foreground">MAC: {device.mac}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddDevice(device);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};