import {
  type Control,
  type FieldPath,
  type FieldValues,
  useFormContext,
} from "react-hook-form";

import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";

interface ISwitchFormProps<T extends FieldValues> {
  control?: Control<T>; // Legacy prop for backward compatibility
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  className?: string;
  description?: string;
  disabled?: boolean;
}

export const SwitchForm = <T extends FieldValues>({
  name,
  label,
  required,
  disabled,
  className,
  description,
}: ISwitchFormProps<T>) => {
  const form = useFormContext();
  const isSubmitting = form.formState.isSubmitting;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, value, ...restField } }) => {
        return (
          <FormItem
            className={`border-border bg-card flex flex-row items-center justify-between rounded-lg border p-4 ${className}`}
          >
            <div className="space-y-0.5">
              {label && (
                <FormLabel className="text-foreground font-medium">
                  {label}{" "}
                  {required && <span className="text-destructive ml-2">*</span>}
                </FormLabel>
              )}
              {description && (
                <FormDescription className="text-xs">
                  {description}
                </FormDescription>
              )}
              <FormMessage className="text-xs" />
            </div>
            <FormControl>
              <Switch
                {...restField}
                checked={value}
                onCheckedChange={onChange}
                disabled={disabled || isSubmitting}
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};
