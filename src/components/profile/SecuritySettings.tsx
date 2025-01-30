import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useSessionManagement } from "@/hooks/useSessionManagement";
import { PasswordSection } from "./security/PasswordSection";
import { SessionSection } from "./security/SessionSection";
import { PrivacySection } from "./security/PrivacySection";
import { TimeoutSettings } from "./security/TimeoutSettings";

const SecuritySettings = () => {
  const navigate = useNavigate();
  const { currentUser, changePassword, logout, deleteAccount, exportData } = useAuth();
  const { sessionTimeout, handleSessionTimeoutChange } = useSessionManagement();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="space-y-6">
      <PasswordSection
        onChangePassword={handleChangePassword}
        isLoading={isLoading}
      />
      
      <TimeoutSettings
        sessionTimeout={sessionTimeout}
        onTimeoutChange={handleSessionTimeoutChange}
      />
      
      <SessionSection
        sessionTimeout={sessionTimeout}
        onSessionTimeoutChange={handleSessionTimeoutChange}
        onLogoutOtherDevices={async () => {
          // Implementation pending backend support
          return Promise.resolve();
        }}
      />
      
      <PrivacySection
        onExportData={exportData}
        onDeleteAccount={async () => {
          try {
            await deleteAccount("");
            toast({
              title: "Account Deleted",
              description: "Your account has been permanently deleted",
            });
            navigate("/login");
          } catch (error) {
            toast({
              title: "Deletion Failed",
              description: "Failed to delete account",
              variant: "destructive",
            });
          }
        }}
      />
    </div>
  );
};

export default SecuritySettings;