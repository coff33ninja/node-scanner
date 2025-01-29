import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "./PasswordInput";
import { Checkbox } from "@/components/ui/checkbox";

interface RegisterFormFieldsProps {
  data: {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    name: string;
  };
  errors: Record<string, string>;
  acceptedTerms: boolean;
  onDataChange: (field: string, value: string) => void;
  onTermsChange: (checked: boolean) => void;
}

export const RegisterFormFields = ({
  data,
  errors,
  acceptedTerms,
  onDataChange,
  onTermsChange
}: RegisterFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="register-username">Username</Label>
        <Input
          id="register-username"
          value={data.username}
          onChange={(e) => onDataChange("username", e.target.value)}
          placeholder="Choose a username"
          className={errors.username ? "border-red-500" : ""}
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username}</p>
        )}
      </div>

      <PasswordInput
        label="Password"
        value={data.password}
        onChange={(value) => onDataChange("password", value)}
        showStrength
        error={errors.password}
        placeholder="Choose a password"
      />

      <PasswordInput
        label="Confirm Password"
        value={data.confirmPassword}
        onChange={(value) => onDataChange("confirmPassword", value)}
        error={errors.confirmPassword}
        placeholder="Confirm your password"
      />

      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          value={data.email}
          onChange={(e) => onDataChange("email", e.target.value)}
          placeholder="Enter your email"
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-name">Full Name</Label>
        <Input
          id="register-name"
          value={data.name}
          onChange={(e) => onDataChange("name", e.target.value)}
          placeholder="Enter your full name"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => onTermsChange(checked as boolean)}
        />
        <Label
          htmlFor="terms"
          className="text-sm cursor-pointer"
        >
          I accept the terms and conditions
        </Label>
      </div>
      {errors.terms && (
        <p className="text-sm text-red-500">{errors.terms}</p>
      )}
    </>
  );
};