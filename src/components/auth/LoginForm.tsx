import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, AlertTriangle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LoginFields } from "./forms/LoginFields";
import { useLoginAttempts } from "./hooks/useLoginAttempts";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      const success = await login(loginData.username, loginData.password);

      if (success) {
        toast({
          title: "Success",
          description: "Login successful!",
        });
        resetAttempts();
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("lastUsername", loginData.username);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("lastUsername");
        }
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
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Account temporarily locked. Please try again in {getRemainingLockoutTime()} minutes.
          </AlertDescription>
        </Alert>
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
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </>
        )}
      </Button>

      <div className="text-center mt-4 space-y-2">
        <a
          href="/forgot-password"
          className="text-sm text-primary hover:underline block"
        >
          Forgot your password?
        </a>
        <div className="text-xs text-muted-foreground">
          By logging in, you agree to our{" "}
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;