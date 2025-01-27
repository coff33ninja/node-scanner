import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import ProfileSettings from "@/components/profile/ProfileSettings";
import SecuritySettings from "@/components/profile/SecuritySettings";

const Account = () => {
  const { currentUser, isFirstRun } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              {isRegistering || isFirstRun ? "Create Account" : "Login"}
            </h1>
            {!isFirstRun && (
              <Button
                variant="outline"
                onClick={() => setIsRegistering(!isRegistering)}
              >
                <LogIn className="mr-2 h-4 w-4" />
                {isRegistering ? "Switch to Login" : "Switch to Register"}
              </Button>
            )}
          </div>

          {isRegistering || isFirstRun ? <RegisterForm /> : <LoginForm />}
        </Card>
      </div>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and security settings
        </p>
      </div>

      <div className="grid gap-6">
        <ProfileSettings />
        <SecuritySettings />
      </div>
    </Layout>
  );
};

export default Account;