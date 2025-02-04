import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Globe, Palette, RefreshCw } from "lucide-react";
import { useState } from "react";

interface GeneralSettingsProps {
  settings: {
    appName: string;
    faviconUrl: string;
    darkMode: boolean;
    accentColor: string;
  };
  onSettingsChange: (settings: any) => void;
}

export const GeneralSettings = ({ settings, onSettingsChange }: GeneralSettingsProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
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
              onChange={(e) => onSettingsChange({ ...settings, appName: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="favicon">Favicon URL</Label>
            <Input 
              id="favicon" 
              placeholder="URL to your favicon.ico"
              value={settings.faviconUrl}
              onChange={(e) => onSettingsChange({ ...settings, faviconUrl: e.target.value })}
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
              onCheckedChange={(checked) => onSettingsChange({ ...settings, darkMode: checked })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="accent-color">Accent Color</Label>
            <div className="flex space-x-2">
              <Input 
                id="accent-color" 
                type="color" 
                className="h-10 w-20"
                value={settings.accentColor}
                onChange={(e) => onSettingsChange({ ...settings, accentColor: e.target.value })}
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onSettingsChange({ ...settings, accentColor: "#0066ff" })}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};