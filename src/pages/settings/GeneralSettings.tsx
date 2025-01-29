import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Palette } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface GeneralSettingsProps {
  settings: {
    appName: string;
    faviconUrl: string;
    darkMode: boolean;
    accentColor: string;
  };
  onSettingChange: (key: string, value: any) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Globe className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Application</h2>
        </div>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="app-name">Application Name</Label>
            <Input 
              id="app-name" 
              value={settings.appName}
              onChange={(e) => onSettingChange('appName', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="favicon">Favicon URL</Label>
            <Input 
              id="favicon" 
              placeholder="URL to your favicon.ico"
              value={settings.faviconUrl}
              onChange={(e) => onSettingChange('faviconUrl', e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Palette className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Appearance</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode">Enable dark mode</Label>
            <Switch 
              id="dark-mode" 
              checked={settings.darkMode}
              onCheckedChange={(checked) => onSettingChange('darkMode', checked)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="accent-color">Accent Color</Label>
            <Input 
              id="accent-color" 
              type="color" 
              className="h-10 w-20"
              value={settings.accentColor}
              onChange={(e) => onSettingChange('accentColor', e.target.value)}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};