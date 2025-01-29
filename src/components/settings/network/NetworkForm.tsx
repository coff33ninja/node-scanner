import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Network } from "lucide-react";

export const NetworkForm = () => {
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Network settings saved",
      description: "Your network settings have been updated successfully.",
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Network className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Network Configuration</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ipRange">IP Range</Label>
          <Input id="ipRange" placeholder="192.168.1.0/24" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="scanInterval">Scan Interval (minutes)</Label>
          <Input id="scanInterval" type="number" min="1" placeholder="5" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timeout">Connection Timeout (seconds)</Label>
          <Input id="timeout" type="number" min="1" placeholder="30" />
        </div>
        <Button type="submit">Save Network Settings</Button>
      </form>
    </Card>
  );
};