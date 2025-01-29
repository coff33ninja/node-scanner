import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye } from "lucide-react";

interface DataSectionProps {
  trackingEnabled: boolean;
  marketingEnabled: boolean;
  onTrackingToggle: (enabled: boolean) => void;
  onMarketingToggle: (enabled: boolean) => void;
}

export const DataSection = ({
  trackingEnabled,
  marketingEnabled,
  onTrackingToggle,
  onMarketingToggle,
}: DataSectionProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Eye className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Data Privacy</h3>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Activity Tracking</Label>
            <p className="text-sm text-muted-foreground">
              Allow us to collect usage data to improve our service
            </p>
          </div>
          <Switch checked={trackingEnabled} onCheckedChange={onTrackingToggle} />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Marketing Communications</Label>
            <p className="text-sm text-muted-foreground">
              Receive updates about new features and promotions
            </p>
          </div>
          <Switch checked={marketingEnabled} onCheckedChange={onMarketingToggle} />
        </div>
      </div>
    </Card>
  );
};