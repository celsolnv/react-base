import { useEffect, useReducer, useRef } from "react";
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from "react-hook-form";

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { useDebounce } from "@/hooks/use-debounce";
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
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";

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

type TComboboxState = {
  open: boolean;
  searchQuery: string;
  isLoading: boolean;
  results: IAsyncComboboxOption[];
  selectedLabel: string;
};

type TComboboxAction =
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: IAsyncComboboxOption[] }
  | { type: "FETCH_ERROR" }
  | { type: "CLEAR_RESULTS" }
  | { type: "SELECT_ITEM"; payload: string }
  | { type: "SET_SELECTED_LABEL"; payload: string };

const initialState: TComboboxState = {
  open: false,
  searchQuery: "",
  isLoading: false,
  results: [],
  selectedLabel: "",
};

function comboboxReducer(
  state: TComboboxState,
  action: TComboboxAction
): TComboboxState {
  switch (action.type) {
    case "SET_OPEN":
      return { ...state, open: action.payload };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "FETCH_START":
      return { ...state, isLoading: true };
    case "FETCH_SUCCESS":
      return { ...state, isLoading: false, results: action.payload };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, results: [] };
    case "CLEAR_RESULTS":
      return { ...state, results: [] };
    case "SELECT_ITEM":
      return {
        ...state,
        selectedLabel: action.payload,
        open: false,
        searchQuery: "",
      };
    case "SET_SELECTED_LABEL":
      return { ...state, selectedLabel: action.payload };
    default:
      return state;
  }
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
  const [{ open, searchQuery, isLoading, results, selectedLabel }, dispatch] =
    useReducer(comboboxReducer, initialState);
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
        dispatch({ type: "CLEAR_RESULTS" });
        return;
      }

      abortControllerRef.current = new AbortController();
      dispatch({ type: "FETCH_START" });

      try {
        const data = await fetchOptions(debouncedSearch);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Erro ao buscar dados:", error);
        }
        dispatch({ type: "FETCH_ERROR" });
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
      dispatch({ type: "SET_SELECTED_LABEL", payload: "" });
      return;
    }

    const valueStr = String(field.value);

    const foundInResults = results.find((item) => String(item.id) === valueStr);
    if (foundInResults) {
      dispatch({
        type: "SET_SELECTED_LABEL",
        payload: foundInResults.label || foundInResults.name || "",
      });
      return;
    }

    if (fallbackOption && String(fallbackOption.id) === valueStr) {
      dispatch({
        type: "SET_SELECTED_LABEL",
        payload: fallbackOption.label || fallbackOption.name || "",
      });
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
          <Popover
            open={open}
            onOpenChange={(val) => dispatch({ type: "SET_OPEN", payload: val })}
          >
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
              className="w-[--radix-popover-trigger-width] p-0"
              align="start"
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder={placeholder}
                  value={searchQuery}
                  onValueChange={(val) =>
                    dispatch({ type: "SET_SEARCH", payload: val })
                  }
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
                            dispatch({
                              type: "SELECT_ITEM",
                              payload: item.label || item.name || "",
                            });
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
