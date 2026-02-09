"use client";

import * as React from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { Skeleton } from "../skeleton";

interface IPasswordInputProps extends React.ComponentProps<"input"> {
  loading?: boolean;
}
const PasswordInput = React.forwardRef<HTMLInputElement, IPasswordInputProps>(
  (
    { className, loading = false, disabled: isDisabled = false, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const disabled =
      props.value === "" || props.value === undefined || isDisabled;

    return (
      <Skeleton loading={loading}>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            className={cn("hide-password-toggle pr-10", className)}
            loading={false}
            ref={ref}
            {...props}
          />
          <Button
            data-testid="button-show-password"
            aria-label={showPassword ? "hide password" : "show password"}
            type="button"
            variant="ghost"
            size="sm"
            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
          >
            {showPassword && !disabled ? (
              <EyeIcon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>

          {/* hides browsers password toggles */}
          <style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
        </div>
      </Skeleton>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
