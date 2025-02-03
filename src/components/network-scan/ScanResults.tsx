import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { NetworkDevice } from "@/utils/networkUtils";

interface ScanResultsProps {
  results: NetworkDevice[];
  onAddDevice: (device: NetworkDevice) => void;
  onAddAll: () => void;
  includeUnknown: boolean;
  onIncludeUnknownChange: (checked: boolean) => void;
}

export function ScanResults({
  results,
  onAddDevice,
  onAddAll,
  includeUnknown,
  onIncludeUnknownChange,
}: ScanResultsProps) {
  if (!results.length) return null;

  return (
    <div className="space-y-4">
      {results.map((device) => (
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
              onClick={() => onAddDevice(device)}
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
            onCheckedChange={(checked) => onIncludeUnknownChange(checked as boolean)}
          />
          <Label htmlFor="includeUnknown">
            Include devices where name is "Unknown"
          </Label>
        </div>
        <Button onClick={onAddAll} className="w-full">
          Add all devices ({results.length})
        </Button>
      </div>
    </div>
  );
}