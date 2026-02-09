import { useEffect, useRef, useState } from "react";
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

export interface IAsyncComboboxOption {
  id: string;
  label?: string;
  name?: string;
  [key: string]: unknown;
}

interface IAsyncComboboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  fetchOptions: (query: string) => Promise<IAsyncComboboxOption[]>;
  fallbackOption?: IAsyncComboboxOption | null;
  debounceTime?: number;
  minSearchLength?: number;
  emptyMessage?: string;
  loadingMessage?: string;
  disabled?: boolean;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelect?: (item: any) => void;
}

export function AsyncComboboxForm<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Buscar...",
  description,
  required,
  fetchOptions,
  fallbackOption = null,
  debounceTime = 500,
  minSearchLength = 0,
  emptyMessage = "Nenhum resultado encontrado.",
  loadingMessage = "Carregando...",
  disabled = false,
  className = "",
  onSelect,
}: Readonly<IAsyncComboboxProps<T>>) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<IAsyncComboboxOption[]>([]);
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const debouncedSearch = useDebounce(searchQuery, debounceTime);

  const { field } = useController({ control, name });

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

  // Atualiza o label baseado no valor do campo, results e fallbackOption
  useEffect(() => {
    if (!field.value) {
      setSelectedLabel("");
      return;
    }

    const valueStr = String(field.value);

    // Prioridade 1: Busca nos results atuais
    const foundInResults = results.find((item) => String(item.id) === valueStr);
    if (foundInResults) {
      setSelectedLabel(foundInResults.label || foundInResults.name || "");
      return;
    }

    // Prioridade 2: Busca no fallbackOption
    if (fallbackOption && String(fallbackOption.id) === valueStr) {
      setSelectedLabel(fallbackOption.label || fallbackOption.name || "");
    }
  }, [field.value, results, fallbackOption]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", className)}>
          {label && (
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  aria-expanded={open}
                  disabled={disabled}
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {(() => {
                    if (!field.value) {
                      return placeholder;
                    }

                    const valueStr = String(field.value);

                    // Prioridade 1: selectedLabel (estado local atualizado ao clicar)
                    if (selectedLabel) {
                      return selectedLabel;
                    }

                    // Prioridade 2: label encontrado em results
                    const foundInResults = results.find(
                      (item) => String(item.id) === valueStr
                    );
                    if (foundInResults) {
                      return foundInResults.label;
                    }

                    // Prioridade 3: label do fallbackOption
                    if (
                      fallbackOption &&
                      String(fallbackOption.id) === valueStr
                    ) {
                      return fallbackOption.label;
                    }

                    // Prioridade 4: placeholder (nunca mostra o ID puro)
                    return placeholder;
                  })()}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] p-0"
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
                      {minSearchLength > 0 &&
                      searchQuery.length < minSearchLength
                        ? `Digite pelo menos ${minSearchLength} caracteres para buscar.`
                        : emptyMessage}
                    </CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {results.map((item) => (
                        <CommandItem
                          key={item.id}
                          value={item.id}
                          onSelect={() => {
                            // Converte para número se o campo espera número
                            const value =
                              typeof field.value === "number"
                                ? Number(item.id)
                                : item.id;
                            field.onChange(value);
                            setSelectedLabel(item.label || item.name || "");
                            setOpen(false);
                            setSearchQuery("");
                            onSelect?.(item);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              String(field.value) === String(item.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {item.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {/* Espaço reservado para evitar layout shift */}
          <div className="space-y-1 leading-none">
            {description && (
              <FormDescription className="text-xs">
                {description}
              </FormDescription>
            )}
            <FormMessage className="text-xs" />
          </div>
        </FormItem>
      )}
    />
  );
}
