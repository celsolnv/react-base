import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import type { TGenericListSchema } from "@/constants/schemas/list";

import * as api from "../api";

// Factory de keys para o React Query
export const {{namePascal}}Keys = {
  all: ["{{nameKebab}}"] as const,
  lists: () => [...{{namePascal}}Keys.all, "list"] as const,
  list: (params: TGenericListSchema) =>
    [...{{namePascal}}Keys.lists(), params] as const,
};

export const listQuery = (params: TGenericListSchema) =>
  queryOptions({
    queryKey: {{namePascal}}Keys.list(params),
    queryFn: () => api.list(params),
    retry: false,
    staleTime: 0, // Sempre verifica

    // UX Pro: Mantém os dados antigos visíveis enquanto carrega a nova página
    // Evita aquele "pisca" de loading
    placeholderData: keepPreviousData,
  });
