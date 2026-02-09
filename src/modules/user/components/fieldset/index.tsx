import { Input, Label } from "@/components/shadcn";

interface IFieldsetProps {
  label: string;
  id: string;
  type?: React.ComponentProps<"input">["type"];
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required: boolean;
}
export function Fieldset({
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
  required = true,
}: IFieldsetProps) {
  return (
    <div className="col-span-12 sm:col-span-6">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span className="text-muted-foreground ml-1 text-xs">*</span>
        )}
        {!required && (
          <span className="text-muted-foreground ml-1 text-xs">(opcional)</span>
        )}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="mt-2"
        placeholder={placeholder}
      />
    </div>
  );
}
