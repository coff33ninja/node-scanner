import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Key, Shield, LogOut, Download, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const SecuritySettings = () => {
  const { currentUser, changePassword, logout, deleteAccount, exportData } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    return strength;
  };

  const handleChangePassword = async () => {
    if (calculatePasswordStrength(newPassword) < 75) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password with at least 8 characters, including uppercase, numbers, and special characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const success = await changePassword(currentPassword, newPassword);
    setIsLoading(false);

    toast({
      title: success ? "Password updated" : "Update failed",
      description: success
        ? "Your password has been changed successfully."
        : "Current password is incorrect or there was an error.",
      variant: success ? "default" : "destructive",
    });

    if (success) {
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  const handleExportData = async () => {
    const data = await exportData();
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `upsnap-data-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  return (
    <div className="space-y-6">
      {!currentUser?.passwordChanged && (
        <div className="bg-warning-50 border-warning-200 border p-4 rounded-md mb-4">
          <p className="text-warning-800">
            Please change your default password to secure your account.
          </p>
        </div>
      )}

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
              className="animate-slide-in"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="animate-slide-in"
            />
            {newPassword && (
              <div className="space-y-2">
                <Progress value={passwordStrength} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  Password strength: {passwordStrength >= 75 ? "Strong" : passwordStrength >= 50 ? "Medium" : "Weak"}
                </p>
              </div>
            )}
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

      <div className="pt-6 border-t">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Security</h3>
        </div>
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={handleExportData}
            className="w-full space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Account Data</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full space-x-2">
                <Trash2 className="h-4 w-4" />
                <span>Delete Account</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    const success = await deleteAccount();
                    if (success) {
                      navigate("/account");
                    }
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            variant="destructive"
            onClick={() => {
              logout();
              navigate("/account");
            }}
            className="w-full space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;