import {
  type FieldPath,
  type FieldValues,
  useFormContext,
} from "react-hook-form";

import { twMerge } from "tailwind-merge";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn";

interface ISelectOption {
  value: string;
  label: string;
}

interface IControlledSelectProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options: ISelectOption[];
  className?: string;
  classNameSelect?: string;
  disabled?: boolean;
  description?: string;
}

export const SelectForm = <T extends FieldValues>({
  name,
  label,
  placeholder,
  required,
  options,
  className,
  classNameSelect,
  description,
  disabled = false,
}: Readonly<IControlledSelectProps<T>>) => {
  const form = useFormContext();
  const isSubmitting = form.formState.isSubmitting;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        // Garante que o valor seja string e corresponda a uma opção válida
        const stringValue = field.value ? String(field.value) : undefined;

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel className="text-foreground font-medium">
                {label}{" "}
                {required && <span className="text-destructive">*</span>}
              </FormLabel>
            )}
            <Select
              onValueChange={field.onChange}
              value={stringValue}
              defaultValue={stringValue}
              disabled={disabled}
              key={stringValue} // Força re-renderização quando o valor muda
            >
              <FormControl className={twMerge(classNameSelect, "w-full")}>
                <SelectTrigger
                  className="bg-background/60 border-border"
                  isLoading={isSubmitting}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-popover border-border">
                {options.map((option) => (
                  <SelectItem
                    className="focus:bg-secondary/50"
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
