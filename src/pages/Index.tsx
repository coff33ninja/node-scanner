import Layout from "../components/Layout";
import { DeviceCard } from "../components/DeviceCard";
import { AddDeviceDialog } from "../components/AddDeviceDialog";
import { DeviceStats } from "../components/DeviceStats";
import { NetworkScanButton } from "../components/NetworkScanButton";
import { useNetworkScanner } from "../hooks/useNetworkScanner";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { devices: networkDevices, isLoading } = useNetworkScanner();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

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
          <AddDeviceDialog />
        </div>
      </div>

      <DeviceStats devices={networkDevices} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {networkDevices.map((device) => (
          <DeviceCard
            key={device.mac}
            {...device}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Index;