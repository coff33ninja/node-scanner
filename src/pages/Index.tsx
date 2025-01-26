import Layout from "@/components/Layout";
import { DeviceCard } from "@/components/DeviceCard";
import { AddDeviceDialog } from "@/components/AddDeviceDialog";
import { DeviceStats } from "@/components/DeviceStats";
import { useState } from "react";
import { NetworkDevice } from "@/utils/networkUtils";

const Index = () => {
  const [devices, setDevices] = useState<NetworkDevice[]>([]);

  const handleAddDevice = (device: NetworkDevice) => {
    setDevices(prev => [...prev, {
      ...device,
      status: 'online',
      lastSeen: new Date().toLocaleString()
    }]);
  };

  const handleDeleteDevice = (deviceToDelete: NetworkDevice) => {
    setDevices(prev => prev.filter(device => device.ip !== deviceToDelete.ip));
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
        {devices.map((device) => (
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