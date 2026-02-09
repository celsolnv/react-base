import { keepPreviousData, queryOptions } from "@tanstack/react-query";

import type { TClientListSchema } from "../../list/schema";
import * as api from "../api";

// Factory de keys para o React Query
export const ClientKeys = {
  all: ["client"] as const,
  lists: () => [...ClientKeys.all, "list"] as const,
  list: (params: TClientListSchema) => [...ClientKeys.lists(), params] as const,
};

export const listQuery = (params: TClientListSchema) =>
  queryOptions({
    queryKey: ClientKeys.list(params),
    queryFn: () => api.list(params),
    retry: false,
    staleTime: 0, // Sempre verifica

    // UX Pro: Mantém os dados antigos visíveis enquanto carrega a nova página
    // Evita aquele "pisca" de loading
    placeholderData: keepPreviousData,
  });
