import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Network } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface NetworkSettingsProps {
  settings: {
    networkSubnet: string;
    autoScan: boolean;
  };
  onSettingChange: (key: string, value: any) => void;
}

export const NetworkSettings: React.FC<NetworkSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Network className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Network Settings</h2>
      </div>
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="subnet">Network Subnet</Label>
          <Input 
            id="subnet" 
            value={settings.networkSubnet}
            onChange={(e) => onSettingChange('networkSubnet', e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-scan">Enable automatic network scanning</Label>
          <Switch 
            id="auto-scan" 
            checked={settings.autoScan}
            onCheckedChange={(checked) => onSettingChange('autoScan', checked)}
          />
        </div>
      </div>
    </Card>
  );
};