import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Key, Shield, LogOut, Download, Trash2, Smartphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { validatePassword } from "@/utils/passwordUtils";

const SecuritySettings = () => {
  const { currentUser, changePassword, logout, deleteAccount, exportData, enableTwoFactor, disableTwoFactor, validateSession } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [sessionTimeout, setSessionTimeout] = useState(30); // minutes

  useEffect(() => {
    // Validate session periodically
    const interval = setInterval(async () => {
      const isValid = await validateSession();
      if (!isValid) {
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        logout();
        navigate("/login");
      }
    }, sessionTimeout * 60 * 1000);

    return () => clearInterval(interval);
  }, [sessionTimeout]);

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

    setIsLoading(true);
    try {
      const success = await changePassword(currentPassword, newPassword);
      toast({
        title: success ? "Password Updated" : "Update Failed",
        description: success
          ? "Your password has been changed successfully."
          : "Current password is incorrect or there was an error.",
        variant: success ? "default" : "destructive",
      });

      if (success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await exportData();
      if (data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `account-data-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "Data Exported",
          description: "Your account data has been downloaded successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export account data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const success = await deleteAccount(deletePassword);
      if (success) {
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted.",
        });
        navigate("/");
      } else {
        toast({
          title: "Deletion Failed",
          description: "Incorrect password or error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggle2FA = async (enable: boolean) => {
    try {
      if (enable) {
        const result = await enableTwoFactor();
        if (result.success) {
          // Show QR code or setup instructions
          toast({
            title: "2FA Enabled",
            description: "Two-factor authentication has been enabled.",
          });
        }
      } else {
        const success = await disableTwoFactor();
        if (success) {
          toast({
            title: "2FA Disabled",
            description: "Two-factor authentication has been disabled.",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update 2FA settings.",
        variant: "destructive",
      });
    }
  };

  const passwordStrength = validatePassword(newPassword).strength;

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

      <div className="pt-6 border-t">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Security</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={currentUser?.twoFactorEnabled}
              onCheckedChange={handleToggle2FA}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Session Timeout</Label>
              <p className="text-sm text-muted-foreground">
                Automatically log out after inactivity
              </p>
            </div>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(Number(e.target.value))}
              className="border rounded p-1"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <Button
            variant="outline"
            onClick={handleExportData}
            className="w-full space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Account Data</span>
          </Button>

          <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full space-x-2">
                <Trash2 className="h-4 w-4" />
                <span>Delete Account</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Account</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Please enter your password to confirm.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
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
              navigate("/login");
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
