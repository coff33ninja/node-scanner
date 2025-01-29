interface ValidationError {
  field: string;
  message: string;
}

interface ValidationErrorsProps {
  errors: ValidationError[];
}

export const ValidationErrors = ({ errors }: ValidationErrorsProps) => {
  if (!errors.length) return null;

  return (
    <div className="space-y-2">
      {errors.map((error, index) => (
        <p key={index} className="text-sm text-red-500">
          {error.message}
        </p>
      ))}
    </div>
  );
};