import {
  type FieldPath,
  type FieldValues,
  useFormContext,
} from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Textarea } from "@/ui/textarea";

interface IControlledTextareaProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  description?: string;
}

export const TextareaForm = <T extends FieldValues>({
  name,
  label,
  required,
  placeholder,
  disabled,
  className,
  description,
}: IControlledTextareaProps<T>) => {
  const form = useFormContext();
  const isSubmitting = form.formState.isSubmitting;
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className="text-foreground font-medium">
              {label}
              {required && <span className="text-destructive">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Textarea
              {...field}
              loading={isSubmitting}
              placeholder={placeholder}
              disabled={disabled}
            />
          </FormControl>
          {description && (
            <FormDescription className="text-muted-foreground">
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
