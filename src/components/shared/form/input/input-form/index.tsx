import {
  type Control,
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
  Input,
} from "@/components/shadcn";

interface IControlledInputProps<T extends FieldValues> {
  control?: Control<T>; // Legacy prop for backward compatibility
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  classNameInput?: string;
  description?: string;
  mask?: (value: string) => string;
  type?: React.ComponentProps<"input">["type"];
  min?: React.ComponentProps<"input">["min"];
  disabled?: React.ComponentProps<"input">["disabled"];
  autoComplete?: React.ComponentProps<"input">["autoComplete"];
}

export const InputForm = <T extends FieldValues>({
  name,
  label,
  required,
  type,
  placeholder,
  min,
  disabled,
  className,
  classNameInput,
  description,
  autoComplete,
  mask,
}: IControlledInputProps<T>) => {
  const form = useFormContext();
  const isSubmitting = form.formState.isSubmitting;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, value, ...restField } }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const rawValue = e.target.value;
          const maskedValue = mask ? mask(rawValue) : rawValue;
          onChange(maskedValue);
        };
        return (
          <FormItem className={className}>
            {label && (
              <FormLabel className="text-foreground font-medium">
                {label}{" "}
                {required && <span className="text-destructive ml-2">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <Input
                {...restField}
                onChange={handleChange}
                value={value}
                loading={isSubmitting}
                min={min}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                className={classNameInput}
                autoComplete={autoComplete}
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
