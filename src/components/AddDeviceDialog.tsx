import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Scan } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { NetworkScanDialog } from "./NetworkScanDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AddDeviceDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    ip: "",
    mac: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Device Added",
      description: `${formData.name} has been added to your devices.`,
    });
    setOpen(false);
    setFormData({ name: "", ip: "", mac: "" });
  };

  const handleScanDeviceAdd = (device: any) => {
    toast({
      title: "Device Added",
      description: `${device.name} has been added to your devices.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Device
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="scan">Network Scan</TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Device Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="My Device"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ip">IP Address</Label>
                <Input
                  id="ip"
                  value={formData.ip}
                  onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                  placeholder="192.168.1.100"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mac">MAC Address</Label>
                <Input
                  id="mac"
                  value={formData.mac}
                  onChange={(e) => setFormData({ ...formData, mac: e.target.value })}
                  placeholder="00:00:00:00:00:00"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Device</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="scan">
            <NetworkScanDialog onDeviceAdd={handleScanDeviceAdd} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};