import { type Control, type FieldValues, useFormState } from "react-hook-form";

import type { ButtonProps } from "@/components/shadcn";
import { Button } from "@/components/shadcn";

interface IButtonForm<T extends FieldValues> extends ButtonProps {
  control: Control<T>;
}
export const ButtonForm = <T extends FieldValues>({
  control,
  children,
  ...props
}: IButtonForm<T>) => {
  const { isSubmitting } = useFormState({ control });
  return (
    <Button disabled={isSubmitting} type="submit" {...props}>
      {children}
    </Button>
  );
};
