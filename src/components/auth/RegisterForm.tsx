import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { validatePassword } from "@/utils/passwordUtils";
import { RegisterFormFields } from "./forms/RegisterFormFields";

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

    const passwordValidation = validatePassword(registerData.password);
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

  const handleDataChange = (field: string, value: string) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <RegisterFormFields
        data={registerData}
        errors={validationErrors}
        acceptedTerms={acceptedTerms}
        onDataChange={handleDataChange}
        onTermsChange={setAcceptedTerms}
      />

      <Button
        onClick={handleRegister}
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </div>
  );
};

export default RegisterForm;
