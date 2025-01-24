import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Scan } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ScanResult {
  name: string;
  ip: string;
  mac: string;
  macVendor?: string;
  netmask: string;
}

export const NetworkScanDialog = ({
  onDeviceAdd,
}: {
  onDeviceAdd: (device: ScanResult) => void;
}) => {
  const [ipRange, setIpRange] = useState("192.168.1.0/24");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [includeUnknown, setIncludeUnknown] = useState(true);
  const { toast } = useToast();

  const handleScan = async () => {
    setIsScanning(true);
    // Simulated scan results
    setTimeout(() => {
      setScanResults([
        {
          name: "ZYXEL",
          ip: "192.168.1.1",
          mac: "50:E0:39:0B:38:20",
          macVendor: "Zyxel Communications",
          netmask: "255.255.255.0",
        },
        {
          name: "Unknown",
          ip: "192.168.1.115",
          mac: "40:B0:76:A4:1F:E3",
          netmask: "255.255.255.0",
        },
      ]);
      setIsScanning(false);
      toast({
        title: "Scan Complete",
        description: "Network scan has completed.",
      });
    }, 2000);
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
                      {device.macVendor && <p>Vendor: {device.macVendor}</p>}
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