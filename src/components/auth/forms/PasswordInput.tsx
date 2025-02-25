import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { validatePassword } from "@/utils/passwordUtils";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showStrength?: boolean;
  error?: string;
  placeholder?: string;
}

export const PasswordInput = ({
  label,
  value,
  onChange,
  showStrength = false,
  error,
  placeholder
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordStrength = showStrength ? validatePassword(value).strength : 0;

  return (
    <div className="space-y-2">
      <Label htmlFor="password">{label}</Label>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={error ? "border-red-500" : ""}
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
      {showStrength && value && (
        <>
          <Progress
            value={passwordStrength}
            className="h-2"
            color={
              passwordStrength >= 75 ? "green" :
              passwordStrength >= 50 ? "yellow" : "red"
            }
          />
          <p className="text-sm text-muted-foreground">
            Password strength: {
              passwordStrength >= 75 ? "Strong" :
              passwordStrength >= 50 ? "Medium" : "Weak"
            }
          </p>
        </>
      )}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};