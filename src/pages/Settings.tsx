import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Network, Bell, Shield, Database } from "lucide-react";

const Settings = () => {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Configure your application preferences
        </p>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Network className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Network Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="subnet">Network Subnet</Label>
              <Input id="subnet" defaultValue="192.168.1.0/24" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="auto-scan" />
              <Label htmlFor="auto-scan">Enable automatic network scanning</Label>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Bell className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="device-notifications" defaultChecked />
              <Label htmlFor="device-notifications">
                Device status notifications
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="security-alerts" defaultChecked />
              <Label htmlFor="security-alerts">Security alerts</Label>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Shield className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="two-factor" />
              <Label htmlFor="two-factor">Enable two-factor authentication</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="audit-log" defaultChecked />
              <Label htmlFor="audit-log">Enable audit logging</Label>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Database className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Data Management</h2>
          </div>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="backup-location">Backup Location</Label>
              <Input id="backup-location" defaultValue="/var/backups" />
            </div>
            <Button>Create Backup</Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;