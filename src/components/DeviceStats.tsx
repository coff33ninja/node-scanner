import { Card } from "@/components/ui/card";
import { NetworkDevice } from "@/utils/networkUtils";

interface DeviceStatsProps {
  devices: NetworkDevice[];
}

export const DeviceStats = ({ devices }: DeviceStatsProps) => {
  const onlineDevices = devices.filter(device => device.status === 'online').length;
  const offlineDevices = devices.filter(device => device.status === 'offline').length;
  const totalDevices = devices.length;

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Online Devices</h3>
        <p className="text-2xl font-bold">{onlineDevices}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Offline Devices</h3>
        <p className="text-2xl font-bold">{offlineDevices}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Total Devices</h3>
        <p className="text-2xl font-bold">{totalDevices}</p>
      </Card>
    </div>
  );
};