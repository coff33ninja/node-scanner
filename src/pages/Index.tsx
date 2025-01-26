import Layout from "../components/Layout"; // Correct relative path
import { DeviceCard } from "../components/DeviceCard"; // Correct relative path
import { AddDeviceDialog } from "../components/AddDeviceDialog"; // Correct relative path
import { DeviceStats } from "../components/DeviceStats"; // Correct relative path
import { useEffect, useState } from "react";
import { NetworkDevice } from "../utils/networkUtils"; // Correct relative path
import { useToast } from "../components/ui/use-toast"; // Correct relative path
import axios from 'axios'; // Import axios for API calls
const STORAGE_KEY = 'network-devices';

const Index = () => {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const { toast } = useToast();

  // Load devices from localStorage on component mount
  useEffect(() => {
    const storedDevices = localStorage.getItem(STORAGE_KEY);
    if (storedDevices) {
      try {
        const parsedDevices = JSON.parse(storedDevices);
        setDevices(parsedDevices);
      } catch (error) {
        console.error('Error parsing stored devices:', error);
        toast({
          title: "Error",
          description: "Failed to load saved devices",
          variant: "destructive",
        });
      }
    }
  }, [toast]); // Added toast to the dependency array

  // Fetch devices from the backend
  useEffect(() => {
    const fetchDevices = async () => {
      console.log("Fetching devices from API...");
      try {
        const response = await axios.get('/api/scan-network'); // Adjust the endpoint as necessary
        setDevices(response.data);
        console.log("Devices fetched:", response.data); // Log the response data
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);

  // Save devices to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
  }, [devices]);

  const handleAddDevice = (device: NetworkDevice) => {
    setDevices(prev => {
      // Check if device already exists
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
