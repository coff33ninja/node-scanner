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
  disabled?: boolean;
}

export const PasswordInput = ({
  label,
  value,
  onChange,
  showStrength = false,
  error,
  placeholder,
  disabled = false
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordStrength = showStrength ? validatePassword(value).strength : 0;

  const getStrengthColor = (strength: number) => {
    if (strength >= 75) return "bg-green-500";
    if (strength >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase()}>{label}</Label>
      <div className="relative">
        <Input
          id={label.toLowerCase()}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={error ? "border-red-500" : ""}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>
      {showStrength && value && (
        <div className="space-y-1">
          <Progress 
            value={passwordStrength} 
            className={`h-1 ${getStrengthColor(passwordStrength)}`}
          />
          <p className="text-xs text-muted-foreground">
            Password strength: {
              passwordStrength >= 75 ? "Strong" :
              passwordStrength >= 50 ? "Medium" : "Weak"
            }
          </p>
        </div>
      )}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};