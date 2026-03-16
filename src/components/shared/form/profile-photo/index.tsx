import { useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";

import { ProfilePhotoCropper } from "../../profile-photo-cropper";

interface IProfilePhotoFormProps {
  initials: string;
  name: string;
  label: string;
  className?: string;
  onDeleteExistingFile?: () => Promise<void>;
}
export function ProfilePhotoForm({
  initials,
  name,
  label,
  className,
  onDeleteExistingFile,
}: Readonly<IProfilePhotoFormProps>) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col items-center", className)}>
          <FormLabel className="text-foreground mb-2">{label}</FormLabel>
          <FormControl>
            <ProfilePhotoCropper
              value={field.value}
              onChange={field.onChange}
              initials={initials || "U"}
              onDeleteExistingFile={onDeleteExistingFile}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
