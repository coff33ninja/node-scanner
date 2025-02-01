import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useNetworkScanner } from "@/hooks/useNetworkScanner";

export const NetworkScanButton = () => {
  const { scanNetwork, isScanning } = useNetworkScanner();

  const handleScan = () => {
    scanNetwork({
      ipRange: '192.168.1.0/24',
      timeout: 1000,
      ports: [22, 80, 443, 3389, 5900]
    });
  };

  return (
    <Button
      onClick={handleScan}
      disabled={isScanning}
      variant="outline"
      size="sm"
    >
      {isScanning ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Scanning...
        </>
      ) : (
        <>
          <RefreshCw className="mr-2 h-4 w-4" />
          Scan Network
        </>
      )}
    </Button>
  );
};