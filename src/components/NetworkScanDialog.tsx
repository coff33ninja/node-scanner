import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { NetworkDevice, scanNetwork } from "@/utils/networkUtils";

interface NetworkScanDialogProps {
  onDeviceAdd: (device: NetworkDevice) => void;
}

export const NetworkScanDialog = ({ onDeviceAdd }: NetworkScanDialogProps) => {
  const [ipRange, setIpRange] = useState("192.168.1.0/24");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<NetworkDevice[]>([]);
  const [includeUnknown, setIncludeUnknown] = useState(true);
  const { toast } = useToast();

  const handleScan = async () => {
    setIsScanning(true);
    try {
      const results = await scanNetwork({ 
        ipRange,
        timeout: 1000,
        ports: [80, 443, 22, 21]
      });
      
      // Transform scan results to match NetworkDevice type with correct status type
      const devices: NetworkDevice[] = results.map(device => ({
        ...device,
        status: 'online' as const, // Explicitly set as 'online' literal type
        lastSeen: new Date().toLocaleString()
      }));
      
      setScanResults(devices);
      toast({
        title: "Scan Complete",
        description: `Found ${devices.length} devices on your network.`,
      });
    } catch (error) {
      console.error('Scan failed:', error);
      toast({
        title: "Scan Failed",
        description: "Failed to scan network. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddAll = () => {
    const devicesToAdd = scanResults.filter(
      (device) => includeUnknown || device.name !== "Unknown"
    );
    devicesToAdd.forEach((device) => onDeviceAdd(device));
    toast({
      title: "Devices Added",
      description: `Added ${devicesToAdd.length} devices to your network.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="ipRange">IP range</Label>
          <div className="flex space-x-2">
            <Input
              id="ipRange"
              value={ipRange}
              onChange={(e) => setIpRange(e.target.value)}
              placeholder="192.168.1.0/24"
            />
            <Button
              onClick={handleScan}
              disabled={isScanning}
              className="min-w-[100px]"
            >
              {isScanning ? "Scanning..." : "Scan"}
            </Button>
          </div>
        </div>

        {scanResults.length > 0 && (
          <div className="space-y-4">
            {scanResults.map((device) => (
              <Card key={device.mac} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{device.name}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>IP: {device.ip}</p>
                      <p>MAC: {device.mac}</p>
                      {device.vendor && <p>Vendor: {device.vendor}</p>}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => onDeviceAdd(device)}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
              </Card>
            ))}

            <div className="space-y-4 pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeUnknown"
                  checked={includeUnknown}
                  onCheckedChange={(checked) =>
                    setIncludeUnknown(checked as boolean)
                  }
                />
                <Label htmlFor="includeUnknown">
                  Include devices where name is "Unknown"
                </Label>
              </div>
              <Button onClick={handleAddAll} className="w-full">
                Add all devices ({scanResults.length})
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};