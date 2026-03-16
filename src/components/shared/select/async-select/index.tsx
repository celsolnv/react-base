import { useId } from "react";

import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";

import type { IAsyncSelectOption } from "./use-async-select";
import { useAsyncSelect } from "./use-async-select";

export type { IAsyncSelectOption } from "./use-async-select";

interface IAsyncSelectProps {
  value?: string | string[];
  onValueChange: (value: string | string[]) => void;
  fetchOptions: (query: string) => Promise<IAsyncSelectOption[]>;
  placeholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  debounceTime?: number;
  minSearchLength?: number;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  maxSelectedDisplay?: number;
}

export function AsyncSelect({
  value,
  onValueChange,
  fetchOptions,
  placeholder = "Selecionar...",
  emptyMessage = "Nenhum resultado encontrado.",
  loadingMessage = "Carregando...",
  debounceTime = 500,
  minSearchLength = 0,
  multiple = false,
  disabled = false,
  className = "",
  maxSelectedDisplay = 2,
}: Readonly<IAsyncSelectProps>) {
  const listboxId = useId();

  const {
    open,
    searchQuery,
    isLoading,
    results,
    hasSelection,
    setOpen,
    setSearchQuery,
    handleSelect,
    handleClear,
    getSelectedLabels,
    isItemSelected,
    emptyMessage: hookEmptyMessage,
    loadingMessage: hookLoadingMessage,
    minSearchLength: hookMinSearchLength,
  } = useAsyncSelect({
    value,
    onValueChange,
    fetchOptions,
    placeholder,
    emptyMessage,
    loadingMessage,
    debounceTime,
    minSearchLength,
    multiple,
    maxSelectedDisplay,
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          disabled={disabled}
          className={cn(
            "bg-muted/50 w-full justify-between",
            !hasSelection && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">{getSelectedLabels()}</span>
          <div className="flex items-center gap-1">
            {hasSelection && !disabled && (
              <X
                className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList id={listboxId}>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="text-muted-foreground text-sm">
                  {hookLoadingMessage}
                </span>
              </div>
            ) : results.length === 0 ? (
              <CommandEmpty>
                {hookMinSearchLength > 0 &&
                searchQuery.length < hookMinSearchLength
                  ? `Digite pelo menos ${hookMinSearchLength} caracteres para buscar.`
                  : hookEmptyMessage}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {results.map((item) => {
                  const isSelected = isItemSelected(item.id);
                  return (
                    <CommandItem
                      key={item.id}
                      value={item.id}
                      onSelect={() => handleSelect(item.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="flex-1">
                        {item.label || item.name || item.id}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
