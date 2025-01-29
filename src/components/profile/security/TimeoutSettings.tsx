import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";

interface TimeoutSettingsProps {
  sessionTimeout: number;
  onTimeoutChange: (minutes: number) => void;
}

export const TimeoutSettings = ({
  sessionTimeout,
  onTimeoutChange,
}: TimeoutSettingsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Session Timeout</h3>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Auto-logout after inactivity</Label>
          <p className="text-sm text-muted-foreground">
            Choose how long to stay logged in when inactive
          </p>
        </div>
        <Select
          value={String(sessionTimeout)}
          onValueChange={(value) => onTimeoutChange(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">1 hour</SelectItem>
            <SelectItem value="120">2 hours</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};