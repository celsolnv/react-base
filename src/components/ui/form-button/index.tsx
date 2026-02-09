import React from "react";

import { cn } from "@/lib/utils";

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
}

export const FormButton: React.FC<FormButtonProps> = ({
  children,
  className,
  variant = "primary",
  fullWidth = true,
  ...props
}) => {
  return (
    <button
      className={cn(
        "min-h-10 gap-2 rounded-md px-4 py-2.5 font-medium whitespace-nowrap transition-colors hover:cursor-pointer",
        {
          "bg-primary text-stone-50 hover:bg-[#462c24]": variant === "primary",
          "bg-stone-200 text-stone-900 hover:bg-stone-300":
            variant === "secondary",
          "border border-stone-200 bg-transparent text-stone-900 hover:bg-stone-100":
            variant === "outline",
          "w-full": fullWidth,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
