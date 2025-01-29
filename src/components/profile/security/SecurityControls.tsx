import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Shield, Download, Trash2, LogOut } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";

interface SecurityControlsProps {
  currentUser: {
    twoFactorEnabled?: boolean;
  };
  onToggle2FA: (enable: boolean) => Promise<void>;
  onExportData: () => Promise<void>;
  onDeleteAccount: (password: string) => Promise<void>;
  onLogout: () => void;
  sessionTimeout: number;
  onSessionTimeoutChange: (timeout: number) => void;
}

export const SecurityControls = ({
  currentUser,
  onToggle2FA,
  onExportData,
  onDeleteAccount,
  onLogout,
  sessionTimeout,
  onSessionTimeoutChange,
}: SecurityControlsProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  return (
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
            onCheckedChange={onToggle2FA}
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
            onChange={(e) => onSessionTimeoutChange(Number(e.target.value))}
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
          onClick={onExportData}
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
                onClick={() => onDeleteAccount(deletePassword)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          variant="destructive"
          onClick={onLogout}
          className="w-full space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};