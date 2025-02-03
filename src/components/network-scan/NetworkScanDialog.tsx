import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { NetworkDevice, scanNetwork } from "@/utils/networkUtils";
import { ScanForm } from "./ScanForm";
import { ScanResults } from "./ScanResults";

interface NetworkScanDialogProps {
  onDeviceAdd: (device: NetworkDevice) => void;
}

export function NetworkScanDialog({ onDeviceAdd }: NetworkScanDialogProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<NetworkDevice[]>([]);
  const [includeUnknown, setIncludeUnknown] = useState(true);
  const { toast } = useToast();

  const handleScan = async (ipRange: string) => {
    setIsScanning(true);
    try {
      const results = await scanNetwork({ 
        ipRange,
        timeout: 1000,
        ports: [80, 443, 22, 21]
      });
      
      setScanResults(results);
      toast({
        title: "Scan Complete",
        description: `Found ${results.length} devices on your network.`,
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
      <ScanForm onScan={handleScan} isScanning={isScanning} />
      <ScanResults
        results={scanResults}
        onAddDevice={onDeviceAdd}
        onAddAll={handleAddAll}
        includeUnknown={includeUnknown}
        onIncludeUnknownChange={setIncludeUnknown}
      />
    </div>
  );
}