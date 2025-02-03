import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ScanFormProps {
  onScan: (ipRange: string) => Promise<void>;
  isScanning: boolean;
}

export function ScanForm({ onScan, isScanning }: ScanFormProps) {
  const [ipRange, setIpRange] = useState("192.168.1.0/24");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScan(ipRange);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="ipRange">IP range</Label>
        <div className="flex space-x-2">
          <Input
            id="ipRange"
            value={ipRange}
            onChange={(e) => setIpRange(e.target.value)}
            placeholder="192.168.1.0/24"
          />
          <Button type="submit" disabled={isScanning}>
            {isScanning ? "Scanning..." : "Scan"}
          </Button>
        </div>
      </div>
    </form>
  );
}