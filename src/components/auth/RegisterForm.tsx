import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import { validatePassword, generatePasswordHint } from "@/utils/passwordUtils";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    name: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string[];
    email?: string;
    name?: string;
    terms?: string;
  }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
  };

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!validateUsername(registerData.username)) {
      errors.username = "Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens";
    }

    if (!validateEmail(registerData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (registerData.name.length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    const passwordValidation = validatePassword(registerData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors;
    }

    if (registerData.password !== registerData.confirmPassword) {
      errors.password = [...(errors.password || []), "Passwords do not match"];
    }

    if (!acceptedTerms) {
      errors.terms = "You must accept the terms and conditions";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      setIsLoading(true);
      const success = await register({
        username: registerData.username,
        password: registerData.password,
        email: registerData.email,
        name: registerData.name,
      });

      if (success) {
        toast({
          title: "Registration successful!",
          description: "Welcome to our platform!",
          variant: "default",
        });
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast({
          title: "Registration failed",
          description: "Username or email already exists",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = validatePassword(registerData.password);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="register-username">Username</Label>
        <Input
          id="register-username"
          value={registerData.username}
          onChange={(e) =>
            setRegisterData({ ...registerData, username: e.target.value })
          }
          placeholder="Choose a username"
          className={validationErrors.username ? "border-red-500" : ""}
        />
        {validationErrors.username && (
          <p className="text-sm text-red-500">{validationErrors.username}</p>
        )}
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
            className={validationErrors.password ? "border-red-500" : ""}
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
        {registerData.password && (
          <>
            <Progress
              value={passwordValidation.strength}
              className="h-2"
              color={
                passwordValidation.strength >= 75 ? "green" :
                passwordValidation.strength >= 50 ? "yellow" : "red"
              }
            />
            <p className="text-sm text-muted-foreground">
              Password strength: {
                passwordValidation.strength >= 75 ? "Strong" :
                passwordValidation.strength >= 50 ? "Medium" : "Weak"
              }
            </p>
          </>
        )}
        {validationErrors.password?.map((error, index) => (
          <p key={index} className="text-sm text-red-500">{error}</p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-confirm-password">Confirm Password</Label>
        <Input
          id="register-confirm-password"
          type={showPassword ? "text" : "password"}
          value={registerData.confirmPassword}
          onChange={(e) =>
            setRegisterData({ ...registerData, confirmPassword: e.target.value })
          }
          placeholder="Confirm your password"
        />
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
          className={validationErrors.email ? "border-red-500" : ""}
        />
        {validationErrors.email && (
          <p className="text-sm text-red-500">{validationErrors.email}</p>
        )}
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
          className={validationErrors.name ? "border-red-500" : ""}
        />
        {validationErrors.name && (
          <p className="text-sm text-red-500">{validationErrors.name}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
        />
        <Label
          htmlFor="terms"
          className="text-sm cursor-pointer"
        >
          I accept the terms and conditions
        </Label>
      </div>
      {validationErrors.terms && (
        <p className="text-sm text-red-500">{validationErrors.terms}</p>
      )}

      <Button
        onClick={handleRegister}
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>

      <p className="text-sm text-muted-foreground mt-4">
        {generatePasswordHint()}
      </p>
    </div>
  );
};

export default RegisterForm;
