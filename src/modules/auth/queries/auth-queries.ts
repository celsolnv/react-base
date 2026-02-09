import { queryOptions } from "@tanstack/react-query";

import api from "@/lib/axios";
import type { IUser } from "@/types";

async function fetchUserProfile() {
  const { data } = await api.get<{ data: IUser }>("/private/user/me");
  return data?.data;
}

export const authQueries = {
  userKey: ["auth", "user"] as const,
  userOptions: () =>
    queryOptions({
      queryKey: authQueries.userKey,
      queryFn: fetchUserProfile,
      // Só tenta buscar se tivermos um token (previne erro 401 desnecessário)
      enabled: !!localStorage.getItem("auth-storage"), // Leitura rápida ou checar store
      retry: false, // Se falhar (401), não fica tentando de novo
      staleTime: 1000 * 60 * 30, // 30min
    }),
};
