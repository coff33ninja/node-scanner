import Layout from "../components/Layout"; 
import { DeviceCard } from "../components/DeviceCard"; 
import { AddDeviceDialog } from "../components/AddDeviceDialog"; 
import { DeviceStats } from "../components/DeviceStats"; 
import { useEffect, useState } from "react";
import { NetworkDevice } from "../utils/networkUtils"; 
import { useToast } from "../components/ui/use-toast"; 
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
        } else {
          throw new Error("Parsed devices is not an array");
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
          setDevices(response.data);
          console.log("Devices fetched:", response.data);
        } else {
          throw new Error("Response data is not an array");
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
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

      <DeviceStats devices={devices} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices.map((device: NetworkDevice) => (
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
    </Layout>
  );
};

export default Index;
