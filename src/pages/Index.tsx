import Layout from "../components/Layout";
import { DeviceCard } from "../components/DeviceCard";
import { NetworkTopology } from "../components/NetworkTopology";
import { DeviceGroups } from "../components/DeviceGroups";
import { NetworkMetrics } from "../components/NetworkMetrics";
import { AddDeviceDialog } from "../components/AddDeviceDialog";
import { DeviceStats } from "../components/DeviceStats";
import { MonitoringDashboard } from "../components/MonitoringDashboard";
import { useEffect, useState } from "react";
import { NetworkDevice } from "../utils/networkUtils";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

const STORAGE_KEY = 'network-devices';

const Index = () => {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
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

  useEffect(() => {
    const fetchDevices = async () => {
      console.log("Fetching devices from API...");
      try {
        const response = await axios.get('/api/scan-network');
        console.log("Response status:", response.status);
        console.log("Response data:", response.data);
        
        if (Array.isArray(response.data)) {
          setDevices(prevDevices => {
            const newDevices = response.data.filter(newDevice => 
              !prevDevices.some(existingDevice => existingDevice.ip === newDevice.ip)
            );
            return [...prevDevices, ...newDevices];
          });
        } else {
          console.warn("API response is not an array:", response.data);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
        // Don't show error toast for network errors as they're expected when backend is not available
        if (error.message !== "Network Error") {
          toast({
            title: "Error",
            description: "Failed to fetch network devices",
            variant: "destructive",
          });
        }
      }
    };

    fetchDevices();
  }, [toast]);

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Network Devices</h1>
          <p className="text-muted-foreground">
            Manage and monitor your network devices
          </p>
        </div>
        <AddDeviceDialog onDeviceAdd={handleAddDevice} />
      </div>

      <div className="grid gap-6">
        <MonitoringDashboard devices={devices} />
        
        <div className="grid gap-6 md:grid-cols-2">
          <NetworkTopology devices={devices} />
          <DeviceGroups />
        </div>

        <DeviceStats devices={devices} />

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
      </div>
    </Layout>
  );
};

export default Index;