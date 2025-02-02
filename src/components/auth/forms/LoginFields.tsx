import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface LoginFieldsProps {
  loginData: {
    email: string;
    password: string;
  };
  showPassword: boolean;
  rememberMe: boolean;
  isLoading: boolean;
  isLocked: boolean;
  onDataChange: (field: string, value: string) => void;
  onShowPasswordChange: (show: boolean) => void;
  onRememberMeChange: (checked: boolean) => void;
}

export const LoginFields = ({
  loginData,
  showPassword,
  rememberMe,
  isLoading,
  isLocked,
  onDataChange,
  onShowPasswordChange,
  onRememberMeChange,
}: LoginFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={loginData.email}
          onChange={(e) => onDataChange("email", e.target.value)}
          placeholder="Enter your email"
          disabled={isLoading || isLocked}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={loginData.password}
            onChange={(e) => onDataChange("password", e.target.value)}
            placeholder="Enter your password"
            disabled={isLoading || isLocked}
          />
          <button
            type="button"
            onClick={() => onShowPasswordChange(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            disabled={isLoading || isLocked}
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
          onCheckedChange={(checked) => onRememberMeChange(checked as boolean)}
          disabled={isLoading || isLocked}
        />
        <Label
          htmlFor="remember-me"
          className="text-sm cursor-pointer"
        >
          Remember me
        </Label>
      </div>
    </div>
  );
};