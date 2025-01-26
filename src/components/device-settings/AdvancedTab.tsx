import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface AdvancedTabProps {
  formData: {
    solPort: string;
    password: string;
    groups: string;
  };
  setFormData: (data: any) => void;
  enableSleepOnLan: boolean;
  setEnableSleepOnLan: (value: boolean) => void;
}

export const AdvancedTab = ({
  formData,
  setFormData,
  enableSleepOnLan,
  setEnableSleepOnLan,
}: AdvancedTabProps) => {
  return (
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
  );
};