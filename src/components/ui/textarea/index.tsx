import * as React from "react";

import { cn } from "@/lib/utils";

import { Skeleton } from "../skeleton";

export interface ITextareaProps extends React.ComponentProps<"textarea"> {
  loading?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, ITextareaProps>(
  ({ className, loading = false, ...props }, ref) => {
    if (loading) {
      return <Skeleton loading={loading} className="min-h-16" />;
    }

    return (
      <textarea
        data-slot="textarea"
        className={cn(
          "border-border placeholder:text-muted-foreground focus-visible:border-foreground focus-visible:ring-foreground/30 focus-visible:shadow-glow aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-background/60 hover:bg-background/70 hover:border-foreground/20 focus-visible:bg-background disabled:bg-background/20 flex field-sizing-content min-h-16 w-full rounded-lg border px-4 py-3 text-sm shadow-xs transition-all outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
