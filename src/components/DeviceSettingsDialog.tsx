import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface DeviceSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: {
    name: string;
    ip: string;
    mac: string;
  };
}

export const DeviceSettingsDialog = ({
  open,
  onOpenChange,
  device,
}: DeviceSettingsProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: device.name,
    ip: device.ip,
    mac: device.mac,
    netmask: "255.255.255.0",
    link: "",
    pingCommand: "",
    wakeCommand: "",
    shutdownCommand: "",
    solPort: "0",
    password: "",
    groups: "",
  });

  const [requireConfirmation, setRequireConfirmation] = useState(false);
  const [enableSleepOnLan, setEnableSleepOnLan] = useState(false);
  const [enableWakeCron, setEnableWakeCron] = useState(false);
  const [enableShutdownCron, setEnableShutdownCron] = useState(false);

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Device settings have been updated successfully.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{device.name} Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="power">Power Management</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ip">IP Address</Label>
                <Input
                  id="ip"
                  value={formData.ip}
                  onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mac">MAC Address</Label>
                <Input
                  id="mac"
                  value={formData.mac}
                  onChange={(e) =>
                    setFormData({ ...formData, mac: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="netmask">Netmask</Label>
                <Input
                  id="netmask"
                  value={formData.netmask}
                  onChange={(e) =>
                    setFormData({ ...formData, netmask: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="link">Link</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="https://"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="power" className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="pingCommand">Custom ping command</Label>
                <Input
                  id="pingCommand"
                  value={formData.pingCommand}
                  onChange={(e) =>
                    setFormData({ ...formData, pingCommand: e.target.value })
                  }
                  placeholder="$:"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="wakeCommand">Custom wake command</Label>
                <Input
                  id="wakeCommand"
                  value={formData.wakeCommand}
                  onChange={(e) =>
                    setFormData({ ...formData, wakeCommand: e.target.value })
                  }
                  placeholder="$:"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="requireConfirmation">Require Confirmation</Label>
                <Switch
                  id="requireConfirmation"
                  checked={requireConfirmation}
                  onCheckedChange={setRequireConfirmation}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="wakeCron">Wake cron</Label>
                <div className="flex space-x-2">
                  <Input
                    id="wakeCron"
                    placeholder="M H DoM M DoW"
                    className="flex-1"
                  />
                  <Switch checked={enableWakeCron} onCheckedChange={setEnableWakeCron} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="solPort">SOL Port</Label>
                <Input
                  id="solPort"
                  type="number"
                  value={formData.solPort}
                  onChange={(e) =>
                    setFormData({ ...formData, solPort: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="enableSleepOnLan">Enable Sleep-On-LAN</Label>
                <Switch
                  id="enableSleepOnLan"
                  checked={enableSleepOnLan}
                  onCheckedChange={setEnableSleepOnLan}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password (SecureON)</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  maxLength={6}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="groups">Groups</Label>
                <Input
                  id="groups"
                  value={formData.groups}
                  onChange={(e) =>
                    setFormData({ ...formData, groups: e.target.value })
                  }
                  placeholder="e.g. 'Basement' or 'Office'"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};