import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { GeneralTab } from "./device-settings/GeneralTab";
import { PowerTab } from "./device-settings/PowerTab";
import { AdvancedTab } from "./device-settings/AdvancedTab";

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

          <TabsContent value="general">
            <GeneralTab formData={formData} setFormData={setFormData} />
          </TabsContent>

          <TabsContent value="power">
            <PowerTab
              formData={formData}
              setFormData={setFormData}
              requireConfirmation={requireConfirmation}
              setRequireConfirmation={setRequireConfirmation}
              enableWakeCron={enableWakeCron}
              setEnableWakeCron={setEnableWakeCron}
            />
          </TabsContent>

          <TabsContent value="advanced">
            <AdvancedTab
              formData={formData}
              setFormData={setFormData}
              enableSleepOnLan={enableSleepOnLan}
              setEnableSleepOnLan={setEnableSleepOnLan}
            />
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