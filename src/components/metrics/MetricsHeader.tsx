import { Card } from "@/components/ui/card";
import { NetworkDevice } from "@/utils/networkUtils";

interface MetricsHeaderProps {
  devices: NetworkDevice[];
  totalBandwidth: {
    upload: number;
    download: number;
  };
}

export function MetricsHeader({ devices, totalBandwidth }: MetricsHeaderProps) {
  const onlineDevices = devices.filter(d => d?.status === 'online').length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Online Devices</h3>
        <p className="text-2xl font-bold">{onlineDevices} / {devices.length}</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Total Upload</h3>
        <p className="text-2xl font-bold">{(totalBandwidth.upload / 1024 / 1024).toFixed(2)} MB/s</p>
      </Card>
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Total Download</h3>
        <p className="text-2xl font-bold">{(totalBandwidth.download / 1024 / 1024).toFixed(2)} MB/s</p>
      </Card>
    </div>
  );
}