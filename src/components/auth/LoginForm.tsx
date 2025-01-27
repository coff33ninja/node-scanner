import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const handleLogin = async () => {
    try {
      if (!loginData.username || !loginData.password) {
        setAuthError("Username and password are required");
        return;
      }
      const success = await login(loginData.username, loginData.password);
      if (success) {
        setAuthSuccess("Login successful!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setAuthError("Invalid username or password");
      }
    } catch (error) {
      setAuthError("Authentication failed. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {authError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {authError}
        </div>
      )}
      {authSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {authSuccess}
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
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      <Button onClick={handleLogin} className="w-full">
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
    </div>
  );
};

export default LoginForm;