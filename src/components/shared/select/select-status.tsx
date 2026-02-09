import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ISelectStatusProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function SelectStatus({
  value,
  onValueChange,
}: Readonly<ISelectStatusProps>) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="bg-muted/50 w-full sm:w-[180px]">
        <SelectValue placeholder="Todos os Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos os Status</SelectItem>
        <SelectItem value="true">Ativo</SelectItem>
        <SelectItem value="false">Inativo</SelectItem>
      </SelectContent>
    </Select>
  );
}
