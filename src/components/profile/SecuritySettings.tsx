import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SecuritySettings = () => {
  const { changePassword, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<string>("");

  const handleChangePassword = async () => {
    const success = await changePassword(currentPassword, newPassword);
    if (success) {
      setCurrentPassword("");
      setNewPassword("");
      setPasswordStatus("Password changed successfully!");
    } else {
      setPasswordStatus("Current password is incorrect");
    }
    setTimeout(() => setPasswordStatus(""), 3000);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-4 mb-4">
        <Key className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Password</h2>
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
        </div>
        <Button onClick={handleChangePassword}>Change Password</Button>
        {passwordStatus && (
          <p
            className={`text-sm ${
              passwordStatus.includes("incorrect")
                ? "text-red-500"
                : "text-green-500"
            }`}
          >
            {passwordStatus}
          </p>
        )}
      </div>

      <div className="pt-4 border-t mt-4">
        <div className="flex items-center space-x-4 mb-4">
          <Shield className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Security</h2>
        </div>
        <Button
          variant="destructive"
          onClick={() => {
            logout();
            navigate("/account");
          }}
        >
          Logout
        </Button>
      </div>
    </Card>
  );
};

export default SecuritySettings;