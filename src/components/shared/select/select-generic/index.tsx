import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { IOptionSelect } from "@/types/Common";

interface ISelectGenericProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: IOptionSelect[];
  className?: string;
}

export function SelectGeneric({
  value,
  onValueChange,
  placeholder = "Selecione uma opção",
  options,
  className,
}: Readonly<ISelectGenericProps>) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn("bg-muted/50 w-full sm:w-[180px]", className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={option.value as string}
            value={option.value as string}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
