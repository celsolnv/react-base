import { useState } from "react";
import { useFormContext, useFormState } from "react-hook-form";

import { Eye, EyeOff } from "lucide-react";

import {
  Button,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/shadcn";

interface IControlledPasswordInputProps {
  name?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  description?: string;
  autoComplete?: string;
  className?: string;
  classNameInput?: string;
}

export const InputPasswordForm = ({
  name = "password",
  label = "Senha",
  required,
  placeholder = "Digite a senha",
  disabled,
  className,
  classNameInput,
  description,
  autoComplete = "current-password",
}: IControlledPasswordInputProps) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
  const { isSubmitting } = useFormState({ control });

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel>
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="group relative">
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                loading={isSubmitting}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                className={`pr-10 ${classNameInput || ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                disabled={disabled}
              >
                {showPassword ? (
                  <EyeOff className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition-colors" />
                ) : (
                  <Eye className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition-colors" />
                )}
              </Button>
            </div>
          </FormControl>
          {/* Espaço reservado para evitar layout shift */}
          <div className="space-y-1 leading-none">
            {description && (
              <FormDescription className="text-xs">
                {description}
              </FormDescription>
            )}
            <FormMessage className="text-xs" />
          </div>
        </FormItem>
      )}
    />
  );
};
