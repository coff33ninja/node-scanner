import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

interface TwoFactorSectionProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const TwoFactorSection = ({ enabled, onToggle }: TwoFactorSectionProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Shield className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Enable 2FA</Label>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security to your account
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
    </Card>
  );
};