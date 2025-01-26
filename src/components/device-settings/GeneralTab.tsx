import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GeneralTabProps {
  formData: {
    name: string;
    ip: string;
    mac: string;
    netmask: string;
    link: string;
  };
  setFormData: (data: any) => void;
}

export const GeneralTab = ({ formData, setFormData }: GeneralTabProps) => {
  return (
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
  );
};