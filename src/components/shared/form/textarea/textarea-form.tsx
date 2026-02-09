import {
  type Control,
  type FieldPath,
  type FieldValues,
  useFormState,
} from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from "@/components/shadcn";

interface IControlledTextareaProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  description?: string;
}

export const TextareaForm = <T extends FieldValues>({
  control,
  name,
  label,
  required,
  placeholder,
  disabled,
  className,
  description,
}: IControlledTextareaProps<T>) => {
  const { isSubmitting } = useFormState({ control });
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
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
              className={className}
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
