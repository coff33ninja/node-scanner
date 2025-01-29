import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Key } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { validatePassword } from "@/utils/passwordUtils";

interface PasswordSectionProps {
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  isLoading: boolean;
}

export const PasswordSection = ({ onChangePassword, isLoading }: PasswordSectionProps) => {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      toast({
        title: "Invalid Password",
        description: validation.errors.join("\n"),
        variant: "destructive",
      });
      return;
    }

    const success = await onChangePassword(currentPassword, newPassword);
    
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const passwordStrength = validatePassword(newPassword).strength;

  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <Key className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Password</h3>
      </div>
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="current-password">Current Password</Label>
          <Input
            id="current-password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {newPassword && (
            <div className="space-y-2">
              <Progress value={passwordStrength} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Password strength: {
                  passwordStrength >= 75 ? "Strong" :
                  passwordStrength >= 50 ? "Medium" : "Weak"
                }
              </p>
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button
          onClick={handleChangePassword}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Changing Password..." : "Change Password"}
        </Button>
      </div>
    </div>
  );
};