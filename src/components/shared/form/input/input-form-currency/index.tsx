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

interface IInputFormCurrencyProps<T extends FieldValues> {
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

export const InputFormCurrency = <T extends FieldValues>({
  name,
  label,
  required,
  placeholder = "0,00",
  disabled,
  className,
  classNameInput,
  description,
  autoComplete,
}: IInputFormCurrencyProps<T>) => {
  const form = useFormContext();
  const isSubmitting = form.formState.isSubmitting;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const rawValue = e.target.value;
          const maskedValue = Mask.money(rawValue);

          // Remove o "R$" da máscara, pois já temos o prefixo visual
          const valueWithoutPrefix = maskedValue.replace(/^R\$\s*/, "");

          // Atualiza o field com o valor formatado sem o prefixo
          field.onChange(valueWithoutPrefix);
        };

        // Obtém o valor para exibição, removendo "R$" se existir
        const displayValue = field.value
          ? String(field.value).replace(/^R\$\s*/, "")
          : "0,00";

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
                <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-medium select-none">
                  R$
                </div>
                <Input
                  {...field}
                  value={displayValue}
                  onChange={handleChange}
                  loading={isSubmitting}
                  type="text"
                  placeholder={placeholder}
                  disabled={disabled}
                  className={`pl-12 ${classNameInput || ""}`}
                  autoComplete={autoComplete}
                />
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
        );
      }}
    />
  );
};
