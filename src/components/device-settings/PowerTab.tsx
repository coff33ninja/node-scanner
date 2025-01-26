import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PowerTabProps {
  formData: {
    pingCommand: string;
    wakeCommand: string;
  };
  setFormData: (data: any) => void;
  requireConfirmation: boolean;
  setRequireConfirmation: (value: boolean) => void;
  enableWakeCron: boolean;
  setEnableWakeCron: (value: boolean) => void;
}

export const PowerTab = ({
  formData,
  setFormData,
  requireConfirmation,
  setRequireConfirmation,
  enableWakeCron,
  setEnableWakeCron,
}: PowerTabProps) => {
  return (
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
  );
};