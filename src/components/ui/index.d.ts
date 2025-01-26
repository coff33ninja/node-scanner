declare module "components/ui/button" {
  import { ButtonHTMLAttributes, ReactNode } from "react";

  export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: string;
    children: ReactNode;
    asChild?: boolean; // Added asChild property
  }

  export const Button: React.FC<ButtonProps>;
}

declare module "components/ui/use-toast" {
  export function useToast(): {
    toast: (options: { title: string; description: string; variant?: string }) => void;
  };
}
