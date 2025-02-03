import Layout from "../components/Layout";
import { DeviceCard } from "../components/DeviceCard";
import { NetworkTopology } from "../components/NetworkTopology";
import { DeviceGroups } from "../components/DeviceGroups";
import { NetworkMetrics } from "../components/NetworkMetrics";
import { AddDeviceDialog } from "../components/AddDeviceDialog";
import { DeviceStats } from "../components/DeviceStats";
import { ServerStatusDashboard } from "../components/ServerStatusDashboard";
import { useEffect, useState } from "react";
import { NetworkDevice } from "../utils/networkUtils";
import { useToast } from "../components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { RefreshCw, Settings } from "lucide-react";
import axios from 'axios';

const STORAGE_KEY = 'network-devices';

const Index = () => {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedDevices = localStorage.getItem(STORAGE_KEY);
    if (storedDevices) {
      try {
        const parsedDevices = JSON.parse(storedDevices);
        if (Array.isArray(parsedDevices)) {
          setDevices(parsedDevices);
        }
      } catch (error) {
        console.error('Error parsing stored devices:', error);
        toast({
          title: "Error",
          description: "Failed to load saved devices",
          variant: "destructive",
        });
      }
    }
  }, [toast]);

  const fetchDevices = async () => {
    setIsRefreshing(true);
    try {
      const response = await axios.get('/api/scan-network');
      if (Array.isArray(response.data)) {
        setDevices(prevDevices => {
          const newDevices = response.data.filter(newDevice => 
            !prevDevices.some(existingDevice => existingDevice.ip === newDevice.ip)
          );
          return [...prevDevices, ...newDevices];
        });
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      if (error instanceof Error && error.message !== "Network Error") {
        toast({
          title: "Error",
          description: "Failed to fetch network devices",
          variant: "destructive",
        });
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  useEffect(() => {
    if (Array.isArray(devices)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
    }
  }, [devices]);

  const handleAddDevice = (device: NetworkDevice) => {
    setDevices(prev => {
      const exists = prev.some(d => d.ip === device.ip);
      if (exists) {
        toast({
          title: "Device Exists",
          description: "This device is already in your list",
          variant: "destructive",
        });
        return prev;
      }
      return [...prev, {
        ...device,
        status: 'online',
        lastSeen: new Date().toLocaleString()
      }];
    });
  };

  const handleDeleteDevice = (deviceToDelete: NetworkDevice) => {
    setDevices(prev => prev.filter(device => device.ip !== deviceToDelete.ip));
    toast({
      title: "Device Removed",
      description: "Device has been removed from your list",
    });
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Network Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor your network devices and server nodes
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchDevices}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <AddDeviceDialog onDeviceAdd={handleAddDevice} />
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <DeviceStats devices={devices} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="topology">Network Topology</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ServerStatusDashboard />
            <NetworkMetrics devices={devices} />
            <div className="grid gap-6 md:grid-cols-2">
              <NetworkTopology devices={devices} />
              <DeviceGroups />
            </div>
          </TabsContent>

          <TabsContent value="devices">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.isArray(devices) && devices.map((device: NetworkDevice) => (
                <DeviceCard
                  key={device.ip}
                  name={device.name || `Device (${device.ip})`}
                  ip={device.ip}
                  mac={device.mac}
                  status={device.status}
                  lastSeen={device.lastSeen}
                  onDelete={() => handleDeleteDevice(device)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="topology" className="space-y-6">
            <NetworkTopology devices={devices} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;