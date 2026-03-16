import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { PhoneInput } from "@/ui/phone-input";

interface IInputPhoneProps {
  name?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  classNameInput?: string;
  description?: string;
  type?: React.ComponentProps<"input">["type"];
  min?: React.ComponentProps<"input">["min"];
  disabled?: React.ComponentProps<"input">["disabled"];
  autoComplete?: React.ComponentProps<"input">["autoComplete"];
}

export const InputPhone = ({
  name = "phone",
  label = "Telefone",
  required,
  type = "tel",
  placeholder = "(00) 0 0000-0000",
  min,
  disabled,
  className,
  classNameInput,
  description,
  autoComplete,
}: IInputPhoneProps) => {
  const form = useFormContext();
  const isSubmitting = form.formState.isSubmitting;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { value, ...restField } }) => {
        return (
          <FormItem className={className}>
            {label && (
              <FormLabel className="text-foreground font-medium">
                {label}{" "}
                {required && <span className="text-destructive ml-2">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <PhoneInput
                {...restField}
                value={value}
                defaultCountry="BR"
                // onChange={handleChange}
                loading={isSubmitting}
                min={min}
                type={type}
                placeholder={placeholder}
                limitMaxLength={true}
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
