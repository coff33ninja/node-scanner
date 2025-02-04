import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Key, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SecuritySettingsProps {
  settings: {
    twoFactor: boolean;
    auditLog: boolean;
  };
  apiKeys: string[];
  onSettingsChange: (settings: any) => void;
  onGenerateApiKey: () => Promise<void>;
  isGeneratingKey: boolean;
}

export const SecuritySettings = ({ 
  settings, 
  apiKeys, 
  onSettingsChange, 
  onGenerateApiKey,
  isGeneratingKey 
}: SecuritySettingsProps) => {
  const { toast } = useToast();

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Shield className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Security</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="two-factor">Enable two-factor authentication</Label>
            <Switch 
              id="two-factor" 
              checked={settings.twoFactor}
              onCheckedChange={(checked) => onSettingsChange({ ...settings, twoFactor: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="audit-log">Enable audit logging</Label>
            <Switch 
              id="audit-log" 
              checked={settings.auditLog}
              onCheckedChange={(checked) => onSettingsChange({ ...settings, auditLog: checked })}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Key className="h-5 w-5" />
          <h2 className="text-xl font-semibold">API Keys</h2>
        </div>
        <div className="space-y-4">
          <Button
            onClick={onGenerateApiKey}
            disabled={isGeneratingKey}
          >
            {isGeneratingKey ? "Generating..." : "Generate New API Key"}
          </Button>
          {apiKeys.map((key, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded">
              <code className="text-sm">{key}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(key);
                  toast({
                    title: "Copied",
                    description: "API key copied to clipboard",
                  });
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};