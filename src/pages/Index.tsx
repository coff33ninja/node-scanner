import Layout from "../components/Layout";
import { DeviceCard } from "../components/DeviceCard";
import { AddDeviceDialog } from "../components/AddDeviceDialog";
import { DeviceStats } from "../components/DeviceStats";
import { useDevices, Device } from "../hooks/useDevices";
import { useAuth } from "../contexts/auth/AuthContext";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { devices, isLoading, addDevice, deleteDevice } = useDevices();
  const { currentUser } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  const transformDeviceToNetworkDevice = (device: Device) => ({
    name: device.name,
    ip: device.ipAddress || '',
    mac: device.macAddress,
    status: 'online' as const,
    lastSeen: device.updatedAt || '',
  });

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Network Devices</h1>
          <p className="text-muted-foreground">
            Manage and monitor your network devices
          </p>
        </div>
        <AddDeviceDialog onDeviceAdd={(device) => addDevice.mutate({
          name: device.name,
          macAddress: device.mac,
          ipAddress: device.ip
        })} />
      </div>

      <DeviceStats devices={devices?.map(transformDeviceToNetworkDevice) || []} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices?.map((device) => {
          const networkDevice = transformDeviceToNetworkDevice(device);
          return (
            <DeviceCard
              key={device.id}
              {...networkDevice}
              onDelete={() => deleteDevice.mutate(device.id)}
            />
          );
        })}
      </div>
    </Layout>
  );
};

export default Index;