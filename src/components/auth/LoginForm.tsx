import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff, LogIn, AlertTriangle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../ui/use-toast";
import { Checkbox } from "../ui/checkbox";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

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

  const [loginAttempts, setLoginAttempts] = useState(() => {
    const stored = localStorage.getItem('loginAttempts');
    return stored ? JSON.parse(stored) : { count: 0, timestamp: 0 };
  });

  useEffect(() => {
    localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
  }, [loginAttempts]);

  const isAccountLocked = () => {
    if (loginAttempts.count >= MAX_LOGIN_ATTEMPTS) {
      const timeElapsed = Date.now() - loginAttempts.timestamp;
      if (timeElapsed < LOCKOUT_TIME) {
        return true;
      } else {
        // Reset attempts after lockout period
        setLoginAttempts({ count: 0, timestamp: 0 });
        return false;
      }
    }
    return false;
  };

  const getRemainingLockoutTime = () => {
    const timeElapsed = Date.now() - loginAttempts.timestamp;
    const remainingTime = Math.ceil((LOCKOUT_TIME - timeElapsed) / 1000 / 60);
    return remainingTime;
  };

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
        // Reset login attempts on successful login
        setLoginAttempts({ count: 0, timestamp: 0 });
        setTimeout(() => navigate("/"), 1500);
      } else {
        // Increment failed attempts
        const newAttempts = {
          count: loginAttempts.count + 1,
          timestamp: Date.now(),
        };
        setLoginAttempts(newAttempts);

        const remainingAttempts = MAX_LOGIN_ATTEMPTS - newAttempts.count;
        toast({
          title: "Login Failed",
          description: remainingAttempts > 0
            ? `Invalid username or password. ${remainingAttempts} attempts remaining.`
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

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={loginData.username}
          onChange={(e) =>
            setLoginData({ ...loginData, username: e.target.value })
          }
          placeholder="Enter your username"
          disabled={isLoading || isAccountLocked()}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            placeholder="Enter your password"
            disabled={isLoading || isAccountLocked()}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            disabled={isLoading || isAccountLocked()}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember-me"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          disabled={isLoading || isAccountLocked()}
        />
        <Label
          htmlFor="remember-me"
          className="text-sm cursor-pointer"
        >
          Remember me
        </Label>
      </div>

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