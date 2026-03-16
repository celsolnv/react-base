import {
  type FieldPath,
  type FieldValues,
  useFormContext,
} from "react-hook-form";

import { InputAutoComplete } from "@/components/ui/input-autocomplete";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";

interface IControlledInputAutocompleteProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  description?: string;
  disabled?: React.ComponentProps<"input">["disabled"];
  options: string[];
}

export const InputAutocompleteForm = <T extends FieldValues>({
  name,
  label,
  required,
  placeholder,
  disabled,
  className,
  description,
  options,
}: IControlledInputAutocompleteProps<T>) => {
  const form = useFormContext();
  const isSubmitting = form.formState.isSubmitting;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={className}>
            {label && (
              <FormLabel className="text-foreground font-medium">
                {label}{" "}
                {required && <span className="text-destructive ml-2">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <InputAutoComplete
                {...field}
                onChange={field.onChange}
                value={field.value}
                loading={isSubmitting}
                placeholder={placeholder}
                disabled={disabled}
                options={options}
              />
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
        );
      }}
    />
  );
};
