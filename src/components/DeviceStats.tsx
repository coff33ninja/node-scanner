import { Card } from "../components/ui/card";
import { NetworkDevice } from "../utils/networkUtils";
import { Laptop, WifiOff, Network } from "lucide-react";

interface DeviceStatsProps {
  devices: NetworkDevice[];
}

export const DeviceStats = ({ devices }: DeviceStatsProps) => {
  const onlineDevices = devices.filter(device => device.status === 'online').length;
  const offlineDevices = devices.filter(device => device.status === 'offline').length;
  const totalDevices = devices.length;

  const stats = [
    {
      title: "Online Devices",
      value: onlineDevices,
      icon: Laptop,
      color: "text-green-500",
      trend: "+2 from last hour"
    },
    {
      title: "Offline Devices",
      value: offlineDevices,
      icon: WifiOff,
      color: "text-red-500",
      trend: "-1 from last hour"
    },
    {
      title: "Total Devices",
      value: totalDevices,
      icon: Network,
      color: "text-blue-500",
      trend: "Updated just now"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <h3 className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </h3>
              </div>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{stat.trend}</p>
        </Card>
      ))}
    </div>
  );
};