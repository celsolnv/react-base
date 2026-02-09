import { Search } from "lucide-react";

import { Input } from "@/components/shadcn";
import { debounce } from "@/utils/func";

interface IInputSearchProps {
  search: string;
  handleSearchChange: (value: string) => void;
}

export function InputSearch({
  search,
  handleSearchChange,
}: Readonly<IInputSearchProps>) {
  const handleSearch = debounce((value: string) => {
    handleSearchChange(value);
  }, 500);

  return (
    <div className="relative w-full sm:w-auto sm:max-w-[320px] sm:min-w-[280px]">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        placeholder="Buscar..."
        defaultValue={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="bg-background/60 border-border hover:bg-background/80 focus:bg-background foc pr-9 pl-9"
        autoFocus
      />
    </div>
  );
}
