import { useState } from "react";
import Layout from "@/components/Layout";
import { DeviceCard } from "@/components/DeviceCard";
import { AddDeviceDialog } from "@/components/AddDeviceDialog";
import { DeviceStats } from "@/components/DeviceStats";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Power } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [devices] = useState([
    {
      id: "1",
      name: "Gateway",
      ip: "192.168.1.1",
      mac: "50:EB:39:0B:38:20",
      status: "online" as const,
      lastSeen: "Just now",
      group: "Network",
    },
    {
      id: "2",
      name: "ASUSTeK Computer",
      ip: "192.168.1.100",
      mac: "40:B0:76:A4:1F:E3",
      status: "offline" as const,
      lastSeen: "11 hours ago",
      group: "Workstations",
    },
  ]);

  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const groups = ["Network", "Workstations", "Servers", "IoT"];
  
  const filteredDevices = selectedGroup === "all" 
    ? devices 
    : devices.filter(device => device.group === selectedGroup);

  const handleBatchOperation = (operation: "wake" | "shutdown") => {
    if (selectedDevices.length === 0) {
      toast({
        title: "No devices selected",
        description: "Please select at least one device to perform this operation.",
      });
      return;
    }

    toast({
      title: `Batch ${operation} initiated`,
      description: `${operation === "wake" ? "Waking" : "Shutting down"} ${selectedDevices.length} devices...`,
    });
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Devices</h1>
          <p className="text-muted-foreground">
            Manage and monitor your network devices
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          <AddDeviceDialog />
        </div>
      </div>

      <DeviceStats />

      <div className="flex items-center justify-between mb-6">
        <Select value={selectedGroup} onValueChange={setSelectedGroup}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Devices</SelectItem>
            {groups.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => handleBatchOperation("wake")}
            disabled={selectedDevices.length === 0}
          >
            <Power className="mr-2 h-4 w-4" />
            Wake Selected
          </Button>
          <Button
            variant="outline"
            onClick={() => handleBatchOperation("shutdown")}
            disabled={selectedDevices.length === 0}
          >
            <Power className="mr-2 h-4 w-4" />
            Shutdown Selected
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDevices.map((device) => (
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