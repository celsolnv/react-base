import * as React from "react";

import { cn } from "@/lib/utils";

import { Skeleton } from "../skeleton";

export interface IInputProps extends React.ComponentProps<"input"> {
  loading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, IInputProps>(
  ({ className, type, loading = false, ...props }, ref) => {
    if (loading) {
      return <Skeleton loading={loading} className="min-h-[40px]" />;
    }

    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          // Base styles
          "border-border bg-background/60 text-foreground h-10 w-full min-w-0 rounded-lg border px-4 text-sm",
          // Placeholder
          "placeholder:text-muted-foreground",
          // Selection
          "selection:bg-primary selection:text-primary-foreground",
          // Hover
          "hover:border-foreground/20 hover:bg-background/70",
          // Focus
          "focus:border-foreground focus:ring-foreground/30 focus:shadow-glow focus:bg-background focus:ring-1 focus:outline-none",
          // Transitions
          "transition-all",
          // Disabled
          "disabled:bg-background/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          // File input
          "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          // Invalid state
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
