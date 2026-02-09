import { useEffect, useRef, useState } from "react";

import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

export interface IAsyncSelectOption {
  id: string;
  label?: string;
  name?: string;
  [key: string]: unknown;
}

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
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<IAsyncSelectOption[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const debouncedSearch = useDebounce(searchQuery, debounceTime);

  // Normaliza o valor para sempre trabalhar com array internamente
  const selectedValues = multiple
    ? Array.isArray(value)
      ? value
      : value
        ? [value]
        : []
    : value
      ? [String(value)]
      : [];

  // Buscar resultados quando o termo de busca mudar
  useEffect(() => {
    const fetchResults = async () => {
      // Cancela requisição anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Verifica se atende o mínimo de caracteres
      if (debouncedSearch.length < minSearchLength) {
        setResults([]);
        return;
      }

      abortControllerRef.current = new AbortController();
      setIsLoading(true);

      try {
        const data = await fetchOptions(debouncedSearch);
        setResults(data);
      } catch (error) {
        // Ignora erros de cancelamento
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Erro ao buscar dados:", error);
        }
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchResults();
    }

    // Cleanup: cancela requisição quando componente desmonta ou dependências mudam
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedSearch, open, fetchOptions, minSearchLength]);

  // Função para obter os labels dos itens selecionados
  const getSelectedLabels = () => {
    if (selectedValues.length === 0) return placeholder;

    const labels = selectedValues
      .map((id) => {
        const found = results.find((item) => String(item.id) === String(id));
        return found ? found.label || found.name || id : id;
      })
      .filter(Boolean);

    if (labels.length === 0) return placeholder;

    if (multiple) {
      if (labels.length <= maxSelectedDisplay) {
        return labels.join(", ");
      }
      return `${labels.slice(0, maxSelectedDisplay).join(", ")} +${labels.length - maxSelectedDisplay}`;
    }

    return labels[0];
  };

  // Função para lidar com a seleção de um item
  const handleSelect = (itemId: string) => {
    if (multiple) {
      const isSelected = selectedValues.includes(itemId);
      const newValues = isSelected
        ? selectedValues.filter((id) => id !== itemId)
        : [...selectedValues, itemId];

      onValueChange(newValues);
    } else {
      onValueChange(itemId);
      setOpen(false);
      setSearchQuery("");
    }
  };

  // Função para limpar a seleção
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange(multiple ? [] : "");
  };

  const hasSelection = selectedValues.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
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
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={placeholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="text-muted-foreground text-sm">
                  {loadingMessage}
                </span>
              </div>
            ) : results.length === 0 ? (
              <CommandEmpty>
                {minSearchLength > 0 && searchQuery.length < minSearchLength
                  ? `Digite pelo menos ${minSearchLength} caracteres para buscar.`
                  : emptyMessage}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {results.map((item) => {
                  const isSelected = selectedValues.includes(String(item.id));
                  return (
                    <CommandItem
                      key={item.id}
                      value={item.id}
                      onSelect={() => handleSelect(String(item.id))}
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
