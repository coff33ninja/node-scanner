import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { validatePassword } from "@/utils/passwordUtils";
import { RegisterFormFields } from "./forms/RegisterFormFields";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus } from "lucide-react";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    name: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const passwordValidation = validatePassword(registerData.password);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!validateUsername(registerData.username)) {
      errors.username = "Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens";
    }

    if (!validateEmail(registerData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (registerData.name.length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0];
    }

    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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

  const handleDataChange = (field: string, value: string) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="space-y-4">
      {Object.keys(validationErrors).length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            Please fix the following errors:
            <ul className="list-disc list-inside mt-2">
              {Object.values(validationErrors).map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <RegisterFormFields
        data={registerData}
        errors={validationErrors}
        acceptedTerms={acceptedTerms}
        onDataChange={handleDataChange}
        onTermsChange={setAcceptedTerms}
      />

      {registerData.password && (
        <div className="space-y-2">
          <Progress value={passwordValidation.strength} className="h-2" />
          <p className="text-sm text-muted-foreground">
            Password strength: {
              passwordValidation.strength >= 75 ? "Strong" :
              passwordValidation.strength >= 50 ? "Medium" : "Weak"
            }
          </p>
        </div>
      )}

      <Button
        onClick={handleRegister}
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4" />
            Create Account
          </>
        )}
      </Button>

      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;