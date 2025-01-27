import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
  });
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const handleRegister = async () => {
    try {
      if (
        !registerData.username ||
        !registerData.password ||
        !registerData.email ||
        !registerData.name
      ) {
        setAuthError("All fields are required");
        return;
      }
      const success = await register(registerData);
      if (success) {
        setAuthSuccess("Registration successful!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setAuthError("Username already exists");
      }
    } catch (error) {
      setAuthError("Registration failed. Please try again.");
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
        <Label htmlFor="register-username">Username</Label>
        <Input
          id="register-username"
          value={registerData.username}
          onChange={(e) =>
            setRegisterData({ ...registerData, username: e.target.value })
          }
          placeholder="Choose a username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <div className="relative">
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            value={registerData.password}
            onChange={(e) =>
              setRegisterData({ ...registerData, password: e.target.value })
            }
            placeholder="Choose a password"
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

      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          value={registerData.email}
          onChange={(e) =>
            setRegisterData({ ...registerData, email: e.target.value })
          }
          placeholder="Enter your email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-name">Full Name</Label>
        <Input
          id="register-name"
          value={registerData.name}
          onChange={(e) =>
            setRegisterData({ ...registerData, name: e.target.value })
          }
          placeholder="Enter your full name"
        />
      </div>

      <Button onClick={handleRegister} className="w-full">
        Create Account
      </Button>
    </div>
  );
};

export default RegisterForm;