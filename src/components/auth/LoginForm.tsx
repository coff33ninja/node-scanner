import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { LoginFields } from "./forms/LoginFields";
import { useLoginAttempts } from "./hooks/useLoginAttempts";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const {
    isAccountLocked,
    getRemainingLockoutTime,
    incrementAttempts,
    resetAttempts,
    attemptsRemaining,
  } = useLoginAttempts();

  const handleLogin = async () => {
    try {
      if (isAccountLocked()) {
        toast({
          title: "Account Temporarily Locked",
          description: `Too many failed attempts. Please try again in ${getRemainingLockoutTime()} minutes.`,
          variant: "destructive",
        });
        return;
      }

      if (!loginData.username || !loginData.password) {
        toast({
          title: "Validation Error",
          description: "Username and password are required",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      const success = await login(loginData.username, loginData.password, rememberMe);

      if (success) {
        toast({
          title: "Success",
          description: "Login successful!",
          variant: "default",
        });
        resetAttempts();
        setTimeout(() => navigate("/"), 1500);
      } else {
        incrementAttempts();
        toast({
          title: "Login Failed",
          description: attemptsRemaining > 0
            ? `Invalid username or password. ${attemptsRemaining} attempts remaining.`
            : "Account temporarily locked. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataChange = (field: string, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      {isAccountLocked() && (
        <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-md">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-600">
            Account temporarily locked. Please try again in {getRemainingLockoutTime()} minutes.
          </p>
        </div>
      )}

      <LoginFields
        loginData={loginData}
        showPassword={showPassword}
        rememberMe={rememberMe}
        isLoading={isLoading}
        isLocked={isAccountLocked()}
        onDataChange={handleDataChange}
        onShowPasswordChange={setShowPassword}
        onRememberMeChange={setRememberMe}
      />

      <Button
        onClick={handleLogin}
        className="w-full"
        disabled={isLoading || isAccountLocked()}
      >
        {isLoading ? (
          "Logging in..."
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </>
        )}
      </Button>

      <div className="text-center mt-4">
        <a
          href="/forgot-password"
          className="text-sm text-primary hover:underline"
        >
          Forgot your password?
        </a>
      </div>
    </div>
  );
};

export default LoginForm;