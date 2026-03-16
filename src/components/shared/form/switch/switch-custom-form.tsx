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

interface ISwitchCustomFormProps<T extends FieldValues> {
  control?: Control<T>;
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  className?: string;
  description?: string;
  disabled?: boolean;
}

export const SwitchCustomForm = <T extends FieldValues>({
  name,
  label,
  required,
  disabled,
  className,
  description,
}: ISwitchCustomFormProps<T>) => {
  const form = useFormContext();
  const isSubmitting = form.formState.isSubmitting;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, value, ...restField } }) => {
        return (
          <FormItem className={`space-y-2 ${className ?? ""}`}>
            {label && (
              <FormLabel className="text-foreground font-medium">
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </FormLabel>
            )}
            {description && (
              <FormDescription className="text-xs">
                {description}
              </FormDescription>
            )}
            <FormControl>
              <div className="mt-[-10px] flex min-h-10 items-center justify-start gap-2 md:mt-[-30px]">
                <Switch
                  {...restField}
                  checked={value}
                  onCheckedChange={onChange}
                  disabled={disabled || isSubmitting}
                  className="data-[state=checked]:bg-green-500"
                />
                <span className="text-muted-foreground text-sm">
                  {value ? "Ativo" : "Inativo"}
                </span>
              </div>
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        );
      }}
    />
  );
};
