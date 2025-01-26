import Layout from "@/components/Layout";
import { DeviceCard } from "@/components/DeviceCard";
import { AddDeviceDialog } from "@/components/AddDeviceDialog";
import { DeviceStats } from "@/components/DeviceStats";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Power, RefreshCw } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { scanNetwork, wakeDevice, shutdownDevice } from "@/utils/networkUtils";
import { useState } from "react";

const Index = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const { data: devices = [], isLoading, refetch } = useQuery({
    queryKey: ['devices'],
    queryFn: () => scanNetwork({ ipRange: '192.168.1.0/24' }),
    refetchOnWindowFocus: false,
  });

  const handleScanNetwork = async () => {
    toast({
      title: "Scanning Network",
      description: "Looking for devices on your network...",
    });
    await refetch();
  };

  const wakeMutation = useMutation({
    mutationFn: (mac: string) => wakeDevice(mac),
    onSuccess: () => {
      toast({
        title: "Wake command sent",
        description: "The wake command has been sent to the device",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to wake device: " + error,
        variant: "destructive",
      });
    },
  });

  const shutdownMutation = useMutation({
    mutationFn: (ip: string) => shutdownDevice(ip),
    onSuccess: () => {
      toast({
        title: "Shutdown command sent",
        description: "The shutdown command has been sent to the device",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to shutdown device: " + error,
        variant: "destructive",
      });
    },
  });

  const groups = ["Network", "Workstations", "Servers", "IoT"];
  
  const filteredDevices = selectedGroup === "all" 
    ? devices 
    : devices.filter(device => device.group === selectedGroup);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Network Devices</h1>
          <p className="text-muted-foreground">
            Manage and monitor your network devices
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleScanNetwork}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          <AddDeviceDialog />
        </div>
      </div>

      <DeviceStats devices={devices} />

      <div className="flex items-center justify-between mb-6">
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Devices</SelectItem>
            {groups.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Scanning network...</div>
      ) : devices.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No devices found. Click the refresh button to scan for devices.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.ip}
              name={device.name || `Device (${device.ip})`}
              ip={device.ip}
              mac={device.mac}
              status={device.status}
              lastSeen={device.lastSeen}
              onDelete={() => console.log("Delete", device.ip)}
            />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Index;