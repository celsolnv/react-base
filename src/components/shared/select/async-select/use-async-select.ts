import { useEffect, useMemo, useReducer, useRef } from "react";

import { useDebounce } from "@/hooks/use-debounce";

export interface IAsyncSelectOption {
  id: string;
  label?: string;
  name?: string;
  [key: string]: unknown;
}

type TAsyncSelectState = {
  open: boolean;
  searchQuery: string;
  isLoading: boolean;
  results: IAsyncSelectOption[];
  cachedResults: Map<string, IAsyncSelectOption>;
};

type TAsyncSelectAction =
  | { type: "SET_OPEN"; payload: boolean }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: IAsyncSelectOption[] }
  | { type: "FETCH_ERROR" }
  | { type: "CLEAR_RESULTS" }
  | { type: "SELECT_SINGLE" }
  | { type: "SELECT_MULTIPLE" };

const initialState: TAsyncSelectState = {
  open: false,
  searchQuery: "",
  isLoading: false,
  results: [],
  cachedResults: new Map(),
};

function asyncSelectReducer(
  state: TAsyncSelectState,
  action: TAsyncSelectAction
): TAsyncSelectState {
  switch (action.type) {
    case "SET_OPEN":
      return { ...state, open: action.payload };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "FETCH_START":
      return { ...state, isLoading: true };
    case "FETCH_SUCCESS": {
      // Adiciona todos os resultados ao cache
      const newCache = new Map(state.cachedResults);
      action.payload.forEach((item) => {
        newCache.set(String(item.id), item);
      });
      return {
        ...state,
        isLoading: false,
        results: action.payload,
        cachedResults: newCache,
      };
    }
    case "FETCH_ERROR":
      return { ...state, isLoading: false, results: [] };
    case "CLEAR_RESULTS":
      return { ...state, results: [] };
    case "SELECT_SINGLE":
      return { ...state, open: false, searchQuery: "" };
    case "SELECT_MULTIPLE":
      // No modo múltiplo, não fecha o popover nem limpa a busca
      return state;
    default:
      return state;
  }
}

// Função para normalizar valores para string
const normalizeValue = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null) return "";
  return String(value);
};

interface IUseAsyncSelectProps {
  value?: string | string[];
  onValueChange: (value: string | string[]) => void;
  fetchOptions: (query: string) => Promise<IAsyncSelectOption[]>;
  placeholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  debounceTime?: number;
  minSearchLength?: number;
  multiple?: boolean;
  maxSelectedDisplay?: number;
}

export function useAsyncSelect({
  value,
  onValueChange,
  fetchOptions,
  placeholder = "Selecionar...",
  emptyMessage = "Nenhum resultado encontrado.",
  loadingMessage = "Carregando...",
  debounceTime = 500,
  minSearchLength = 0,
  multiple = false,
  maxSelectedDisplay = 2,
}: IUseAsyncSelectProps) {
  const [{ open, searchQuery, isLoading, results, cachedResults }, dispatch] =
    useReducer(asyncSelectReducer, initialState);
  const abortControllerRef = useRef<AbortController | null>(null);

  const debouncedSearch = useDebounce(searchQuery, debounceTime);

  // Normaliza o valor para sempre trabalhar com array de strings internamente
  const selectedValues = useMemo(() => {
    if (multiple) {
      if (Array.isArray(value)) {
        return value.map(normalizeValue).filter(Boolean);
      }
      return value ? [normalizeValue(String(value))] : [];
    }
    // No modo single, value pode ser string ou string[], mas tratamos como string
    const singleValue = Array.isArray(value) ? value[0] : value;
    return singleValue ? [normalizeValue(singleValue)] : [];
  }, [value, multiple]);

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

  // Busca inicial de labels quando componente monta com valores selecionados
  useEffect(() => {
    if (selectedValues.length === 0) return;

    // Verifica quais valores selecionados não estão em cache
    const missingIds = selectedValues.filter(
      (id) => !cachedResults.has(normalizeValue(id))
    );

    if (missingIds.length === 0) return;

    // Busca os labels dos valores que não estão em cache
    const fetchInitialLabels = async () => {
      // Cancela requisição anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        // Busca com query vazia para obter todos os resultados (ou os primeiros)
        // Isso depende da API, mas geralmente uma busca vazia retorna resultados
        const data = await fetchOptions("");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Erro ao buscar labels iniciais:", error);
        }
      }
    };

    // Só busca se o popover não estiver aberto (para não interferir na busca do usuário)
    if (!open) {
      fetchInitialLabels();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [selectedValues, cachedResults, open, fetchOptions]);

  // Função para obter os labels dos itens selecionados
  const getSelectedLabels = () => {
    if (selectedValues.length === 0) return placeholder;

    const labels = selectedValues
      .map((id) => {
        const normalizedId = normalizeValue(id);
        // Busca primeiro no cache, depois em results
        const cached = cachedResults.get(normalizedId);
        if (cached) {
          return cached.label || cached.name || normalizedId;
        }
        const found = results.find(
          (item) => normalizeValue(item.id) === normalizedId
        );
        return found ? found.label || found.name || normalizedId : normalizedId;
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
    const normalizedItemId = normalizeValue(itemId);
    if (multiple) {
      // Compara usando valores normalizados
      const isSelected = selectedValues.some(
        (id) => normalizeValue(id) === normalizedItemId
      );
      const newValues = isSelected
        ? selectedValues.filter((id) => normalizeValue(id) !== normalizedItemId)
        : [...selectedValues, normalizedItemId];

      onValueChange(newValues);
      dispatch({ type: "SELECT_MULTIPLE" });
    } else {
      onValueChange(normalizedItemId);
      dispatch({ type: "SELECT_SINGLE" });
    }
  };

  // Função para limpar a seleção
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange(multiple ? [] : "");
  };

  const hasSelection = selectedValues.length > 0;

  // Função auxiliar para verificar se um item está selecionado
  const isItemSelected = (itemId: string) => {
    const normalizedItemId = normalizeValue(itemId);
    return selectedValues.some((id) => normalizeValue(id) === normalizedItemId);
  };

  return {
    // Estado
    open,
    searchQuery,
    isLoading,
    results,
    selectedValues,
    hasSelection,
    // Funções de controle
    setOpen: (val: boolean) => dispatch({ type: "SET_OPEN", payload: val }),
    setSearchQuery: (val: string) =>
      dispatch({ type: "SET_SEARCH", payload: val }),
    handleSelect,
    handleClear,
    getSelectedLabels,
    isItemSelected,
    // Mensagens
    placeholder,
    emptyMessage,
    loadingMessage,
    minSearchLength,
  };
}
