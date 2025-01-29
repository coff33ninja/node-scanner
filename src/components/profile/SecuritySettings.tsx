import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { PasswordSection } from "./security/PasswordSection";
import { SecurityControls } from "./security/SecurityControls";

const SecuritySettings = () => {
  const navigate = useNavigate();
  const { currentUser, changePassword, logout, deleteAccount, exportData, enableTwoFactor, disableTwoFactor } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
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
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle2FA = async (enable: boolean) => {
    try {
      if (enable) {
        const result = await enableTwoFactor();
        if (result.success) {
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

  const handleDeleteAccount = async (password: string) => {
    try {
      const success = await deleteAccount(password);
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="space-y-6">
      <PasswordSection
        onChangePassword={handleChangePassword}
        isLoading={isLoading}
      />
      
      <SecurityControls
        currentUser={currentUser}
        onToggle2FA={handleToggle2FA}
        onExportData={handleExportData}
        onDeleteAccount={handleDeleteAccount}
        onLogout={handleLogout}
        sessionTimeout={sessionTimeout}
        onSessionTimeoutChange={setSessionTimeout}
      />
    </div>
  );
};

export default SecuritySettings;