import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";

import type { IUser } from "@/types";

import { authQueries } from "../queries/auth-queries";
import { useAuthStore } from "../store/auth-store";

export function useAuth() {
  const { accessToken, setAccessToken, clearSession } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigate = useNavigate();

  // Sincroniza o User Data com base no Token
  const { data: user, isLoading } = useQuery({
    ...authQueries.userOptions(),
    enabled: !!accessToken,
  });

  const signIn = async (data: IUser) => {
    const userData = data;
    const token = data?.user_tokens[0]?.token;

    if (!userData) {
      throw new Error("Dados do usuário não encontrados na resposta");
    }

    if (!token) {
      throw new Error("Token não encontrado na resposta");
    }

    setAccessToken(token);
    queryClient.setQueryData(authQueries.userKey, userData);
    await router.invalidate();
    await navigate({ to: "/" });
  };

  const logout = async () => {
    clearSession();
    queryClient.clear();
    await router.invalidate();
    await navigate({ to: "/login" });
  };

  return {
    user,
    isAuthenticated: !!accessToken && !!user, // Só tá logado se tiver token E user carregado
    isLoading,
    signIn,
    logout,
    token: accessToken,
  };
}
