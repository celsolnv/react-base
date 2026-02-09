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
import Mask from "@/utils/masks";

interface IInputFormPercentageProps<T extends FieldValues> {
  control?: Control<T>; // Legacy prop for backward compatibility
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: React.ComponentProps<"input">["disabled"];
  className?: string;
  classNameInput?: string;
  description?: string;
  autoComplete?: React.ComponentProps<"input">["autoComplete"];
}

export const InputFormPercentage = <T extends FieldValues>({
  name,
  label,
  required,
  placeholder = "0,00",
  disabled,
  className,
  classNameInput,
  description,
  autoComplete,
}: IInputFormPercentageProps<T>) => {
  const form = useFormContext();
  const isSubmitting = form.formState.isSubmitting;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const rawValue = e.target.value;
          const maskedValue = Mask.percent(rawValue);

          // Atualiza o field com o valor formatado
          field.onChange(maskedValue);
        };

        // Obtém o valor para exibição
        const displayValue = field.value ? String(field.value) : "0,00";

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel className="text-foreground font-medium">
                {label}{" "}
                {required && <span className="text-destructive ml-2">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div className="relative">
                <Input
                  {...field}
                  value={displayValue}
                  onChange={handleChange}
                  loading={isSubmitting}
                  type="text"
                  placeholder={placeholder}
                  disabled={disabled}
                  className={`pr-10 ${classNameInput || ""}`}
                  autoComplete={autoComplete}
                />
                <div className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-medium select-none">
                  %
                </div>
              </div>
            </FormControl>
            {description && (
              <FormDescription className="text-muted-foreground">
                {description}
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
