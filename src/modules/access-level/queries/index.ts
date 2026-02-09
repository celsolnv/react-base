import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import type { TGenericListSchema } from "@/constants/schemas/list";

import * as api from "../api";

// Factory de keys para o React Query
export const accessLevelKeys = {
  all: ["access-level"] as const,
  lists: () => [...accessLevelKeys.all, "list"] as const,
  list: (params: TGenericListSchema) =>
    [...accessLevelKeys.lists(), params] as const,
};

export const listQuery = (params: TGenericListSchema) =>
  queryOptions({
    queryKey: accessLevelKeys.list(params),
    queryFn: () => api.list(params),
    retry: false,
    staleTime: 0, // Sempre verifica

    // UX Pro: Mantém os dados antigos visíveis enquanto carrega a nova página
    // Evita aquele "pisca" de loading
    placeholderData: keepPreviousData,
  });
