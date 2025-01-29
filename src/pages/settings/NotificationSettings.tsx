import React from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface NotificationSettingsProps {
  settings: {
    deviceNotifications: boolean;
    securityAlerts: boolean;
  };
  onSettingChange: (key: string, value: any) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <Bell className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Notifications</h2>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="device-notifications">Device status notifications</Label>
          <Switch 
            id="device-notifications" 
            checked={settings.deviceNotifications}
            onCheckedChange={(checked) => onSettingChange('deviceNotifications', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="security-alerts">Security alerts</Label>
          <Switch 
            id="security-alerts" 
            checked={settings.securityAlerts}
            onCheckedChange={(checked) => onSettingChange('securityAlerts', checked)}
          />
        </div>
      </div>
    </Card>
  );
};