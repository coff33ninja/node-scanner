import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, LogOut, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SessionSectionProps {
  onSessionTimeoutChange: (minutes: number) => void;
  onLogoutOtherDevices: () => Promise<void>;
  sessionTimeout: number;
}

export const SessionSection = ({
  onSessionTimeoutChange,
  onLogoutOtherDevices,
  sessionTimeout,
}: SessionSectionProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoutOtherDevices = async () => {
    setIsLoading(true);
    try {
      await onLogoutOtherDevices();
      toast({
        title: "Success",
        description: "All other devices have been logged out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout other devices",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Clock className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Session Management</h3>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Session Timeout</Label>
            <p className="text-sm text-muted-foreground">
              Automatically log out after inactivity
            </p>
          </div>
          <select
            value={sessionTimeout}
            onChange={(e) => onSessionTimeoutChange(Number(e.target.value))}
            className="border rounded p-2"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
            <option value={120}>2 hours</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Remember Me</Label>
            <p className="text-sm text-muted-foreground">
              Stay logged in on this device
            </p>
          </div>
          <Switch />
        </div>

        <Button
          variant="outline"
          onClick={handleLogoutOtherDevices}
          disabled={isLoading}
          className="w-full"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {isLoading ? "Logging out..." : "Logout Other Devices"}
        </Button>
      </div>
    </div>
  );
};