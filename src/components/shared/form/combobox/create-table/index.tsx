import { Check, ChevronsUpDown, Plus } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { TriggerContent } from "./trigger-content";
import {
  type TCreatableSelectProps,
  useCreatableSelect,
} from "./use-creatable-select";

export function CreatableSelect(props: TCreatableSelectProps) {
  const {
    open,
    setOpen,
    inputValue,
    setInputValue,
    selectedSet,
    filtered,
    showCreate,
    handleSelect,
    handleCreate,
    handleRemove,
    placeholder,
    multiple,
    value,
  } = useCreatableSelect(props);

  const { disabled = false, className, id } = props;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          id={id}
          type="button"
          aria-expanded={open}
          className={cn(
            "border-input bg-background ring-offset-background flex min-h-10 w-full items-center rounded-md border px-3 py-2 text-sm",
            "focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          <div className="flex-1 text-left">
            <TriggerContent
              value={value}
              multiple={multiple}
              placeholder={placeholder}
              handleRemove={handleRemove}
            />
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Pesquisar..."
            value={inputValue}
            onValueChange={setInputValue}
            onKeyDown={(e) => {
              if (e.key === "Enter" && showCreate) {
                e.preventDefault();
                handleCreate();
              }
            }}
          />
          <CommandList>
            <CommandEmpty className="text-muted-foreground py-2 text-center text-sm">
              Nenhuma opção encontrada.
            </CommandEmpty>
            <CommandGroup>
              {filtered.map((opt) => {
                const isSelected = selectedSet.has(opt.value.toLowerCase());
                return (
                  <CommandItem
                    key={opt.value}
                    value={opt.value}
                    onSelect={() => handleSelect(opt)}
                  >
                    {!multiple && (
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                    )}
                    {opt.label}
                  </CommandItem>
                );
              })}
              {showCreate && (
                <CommandItem
                  value={`__create__${inputValue}`}
                  onSelect={handleCreate}
                  className="text-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Criar &quot;{inputValue}&quot;
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
