import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Network, Bell, Shield, Server, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { NetworkSettings } from "@/components/settings/NetworkSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";

const Settings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [settings, setSettings] = useState({
    appName: "UpSnap",
    faviconUrl: "",
    darkMode: false,
    accentColor: "#0066ff",
    networkSubnet: "192.168.1.0/24",
    autoScan: true,
    deviceNotifications: true,
    securityAlerts: true,
    twoFactor: false,
    auditLog: true
  });

  const [apiKeys, setApiKeys] = useState<string[]>([]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // API call to save settings would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateApiKey = async () => {
    setIsGeneratingKey(true);
    try {
      const response = await fetch('/api/generate-api-key', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.apiKey) {
        setApiKeys(prev => [...prev, data.apiKey]);
        toast({
          title: "API Key Generated",
          description: "New API key has been created successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate API key",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingKey(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your application preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-4">
          <TabsTrigger value="general" className="space-x-2">
            <Globe className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="network" className="space-x-2">
            <Network className="h-4 w-4" />
            <span>Network</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="nodes" className="space-x-2">
            <Server className="h-4 w-4" />
            <span>Nodes</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings 
            settings={settings} 
            onSettingsChange={setSettings} 
          />
        </TabsContent>

        <TabsContent value="network">
          <NetworkSettings 
            settings={settings} 
            onSettingsChange={setSettings} 
          />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings 
            settings={settings}
            apiKeys={apiKeys}
            onSettingsChange={setSettings}
            onGenerateApiKey={handleGenerateApiKey}
            isGeneratingKey={isGeneratingKey}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>{isLoading ? "Saving..." : "Save Changes"}</span>
        </Button>
      </div>
    </Layout>
  );
};

export default Settings;