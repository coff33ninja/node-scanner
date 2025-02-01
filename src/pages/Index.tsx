import Layout from "../components/Layout";
import { DeviceCard } from "../components/DeviceCard";
import { AddDeviceDialog } from "../components/AddDeviceDialog";
import { DeviceStats } from "../components/DeviceStats";
import { NetworkScanButton } from "../components/NetworkScanButton";
import { useDevices } from "../hooks/useDevices";
import { useNetworkScanner } from "../hooks/useNetworkScanner";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { devices: savedDevices, isLoading: isSavedLoading, addDevice, deleteDevice } = useDevices();
  const { devices: networkDevices, isLoading: isNetworkLoading } = useNetworkScanner();

  const isLoading = isSavedLoading || isNetworkLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  // Combine saved and network devices, preferring saved device data
  const allDevices = networkDevices.map(networkDevice => {
    const savedDevice = savedDevices?.find(d => d.macAddress === networkDevice.mac);
    if (savedDevice) {
      return {
        name: savedDevice.name,
        ip: savedDevice.ipAddress || networkDevice.ip,
        mac: savedDevice.macAddress,
        status: networkDevice.status,
        lastSeen: savedDevice.updatedAt || networkDevice.lastSeen,
        openPorts: networkDevice.openPorts
      };
    }
    return {
      name: networkDevice.name,
      ip: networkDevice.ip,
      mac: networkDevice.mac,
      status: networkDevice.status,
      lastSeen: networkDevice.lastSeen,
      openPorts: networkDevice.openPorts
    };
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
        <div className="flex gap-2">
          <NetworkScanButton />
          <AddDeviceDialog onDeviceAdd={(device) => addDevice.mutate({
            name: device.name,
            macAddress: device.mac,
            ipAddress: device.ip
          })} />
        </div>
      </div>

      <DeviceStats devices={allDevices} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allDevices.map((device) => (
          <DeviceCard
            key={device.mac}
            {...device}
            onDelete={() => {
              const savedDevice = savedDevices?.find(d => d.macAddress === device.mac);
              if (savedDevice) {
                deleteDevice.mutate(savedDevice.id);
              }
            }}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Index;