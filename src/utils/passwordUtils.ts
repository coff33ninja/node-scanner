export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecial: true,
  maxLength: 128
};

export interface PasswordValidationResult {
  isValid: boolean;
  strength: number;
  errors: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  let strength = 0;

  // Basic checks
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
  }
  if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
    errors.push(`Password must not exceed ${PASSWORD_REQUIREMENTS.maxLength} characters`);
  }

  // Complexity checks
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    strength += 25;
  }

  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    strength += 25;
  }

  if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    strength += 25;
  }

  if (PASSWORD_REQUIREMENTS.requireSpecial && !/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    strength += 25;
  }

  // Additional strength factors
  if (password.length >= 12) strength += 10;
  if (password.length >= 16) strength += 10;

  // Cap strength at 100
  strength = Math.min(100, strength);

  return {
    isValid: errors.length === 0,
    strength,
    errors
  };
};

export const generatePasswordHint = (): string => {
  return 'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.';
};
