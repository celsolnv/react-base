import { type Control, type FieldValues, useFormState } from "react-hook-form";

import type { IButtonProps } from "@/ui/button";
import { Button } from "@/ui/button";

interface IButtonForm<T extends FieldValues> extends IButtonProps {
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
