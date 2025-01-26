import { useState } from "react";
import { Card } from "@/components/ui/card"; 
import { Button } from "components/ui/button"; 
import { Power, Settings, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils"; 
import { useToast } from "components/ui/use-toast"; 
import { DeviceSettingsDialog } from "./DeviceSettingsDialog";

interface DeviceCardProps {
  name: string;
  ip: string;
  mac: string;
  status: "online" | "offline";
  lastSeen: string;
  openPorts: number[]; 
  onDelete?: () => void;
}

export const DeviceCard = ({
  name,
  ip,
  mac,
  status,
  lastSeen,
  openPorts, 
  onDelete,
}: DeviceCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { toast } = useToast();

  const handleWakeDevice = async () => {
    setIsLoading(true);
    try {
      toast({
        title: "Wake command sent",
        description: `Attempting to wake ${name}...`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to wake device",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={cn(
                  "h-3 w-3 rounded-full",
                  status === "online"
                    ? "bg-success-500 shadow-success-500/50 animate-pulse"
                    : "bg-error-500"
                )}
              />
              <div>
                <h3 className="text-lg font-semibold">
                  <a href={`/device/${ip}`}>{name}</a>
                </h3>
                <p className="text-sm text-muted-foreground">
                  IP: <a href={`http://${ip}`}>{ip}</a>
                </p>
                <p className="text-sm text-muted-foreground">Open Ports:</p>
                <ul>
                  {openPorts.map(port => (
                    <li key={port}>
                      <a href={`http://${ip}:${port}`}>Port {port}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleWakeDevice}
                disabled={isLoading || status === "online"}
              >
                <Power className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDelete}
                  className="text-error-500 hover:text-error-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">MAC Address</p>
              <p className="font-mono">{mac}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Last Seen</p>
              <p>{lastSeen}</p>
            </div>
          </div>
        </div>
      </Card>

      <DeviceSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        device={{ name, ip, mac }}
      />
    </>
  );
};