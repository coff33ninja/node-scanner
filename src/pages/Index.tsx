import { useState } from "react";
import Layout from "@/components/Layout";
import { DeviceCard } from "@/components/DeviceCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  const [devices] = useState([
    {
      id: "1",
      name: "Gateway",
      ip: "192.168.1.1",
      mac: "50:EB:39:0B:38:20",
      status: "online" as const,
      lastSeen: "Just now",
    },
    {
      id: "2",
      name: "ASUSTeK Computer",
      ip: "192.168.1.100",
      mac: "40:B0:76:A4:1F:E3",
      status: "offline" as const,
      lastSeen: "11 hours ago",
    },
  ]);

  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Devices</h1>
          <p className="text-muted-foreground">
            Manage and monitor your network devices
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Device
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            name={device.name}
            ip={device.ip}
            mac={device.mac}
            status={device.status}
            lastSeen={device.lastSeen}
            onDelete={() => console.log("Delete", device.id)}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Index;