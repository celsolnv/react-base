import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import type { TGenericListSchema } from "@/constants/schemas/list";

import * as api from "../api";

// Factory de keys para o React Query
export const __namePascal__Keys = {
  all: ["__nameKebab__"] as const,
  lists: () => [...__namePascal__Keys.all, "list"] as const,
  list: (params: TGenericListSchema) =>
    [...__namePascal__Keys.lists(), params] as const,
};

export const listQuery = (params: TGenericListSchema) =>
  queryOptions({
    queryKey: __namePascal__Keys.list(params),
    queryFn: () => api.list(params),
    retry: false,
    staleTime: 0, // Sempre verifica

    // UX Pro: Mantém os dados antigos visíveis enquanto carrega a nova página
    // Evita aquele "pisca" de loading
    placeholderData: keepPreviousData,
  });
