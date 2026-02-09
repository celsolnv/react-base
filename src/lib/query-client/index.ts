import { MutationCache, QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner"; // Seu componente de Toast

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    // Tenta pegar a mensagem enviada pelo backend (ex: { message: "Senha incorreta" })
    return (
      error.response?.data?.message ||
      error.message ||
      error.response?.data?.error
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Erro desconhecido";
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 1. Configuração de Cache
      // O dado é considerado "fresco" por 1 minuto.
      // O React Query não fará refetch automático nesse período se o componente remontar.
      staleTime: 1000 * 60,

      // 2. Garbage Collection
      // Se o dado não for usado por 10 minutos, ele é removido da memória.
      gcTime: 1000 * 60 * 10,

      // 3. Retry Inteligente
      // Não queremos tentar de novo se for um erro 404 (não encontrado) ou 401 (sem permissão)
      retry: (failureCount, error) => {
        if (failureCount >= 3) return false;

        if (error instanceof AxiosError) {
          const status = error.response?.status;
          // Se for 401, 403 ou 404, não adianta tentar de novo
          if (status && [401, 403, 404].includes(status)) {
            return false;
          }
        }
        return true;
      },

      // 4. UX: Evita refetch ao trocar de aba (opcional, gosto de deixar false em dev)
      refetchOnWindowFocus: false,
    },
  },

  // 5. Tratamento Global de Erros de Mutação
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      // Se a mutation tiver a propriedade "meta: { ignoreGlobalError: true }", ignoramos
      if (mutation.options.meta?.ignoreGlobalError) return;

      // Caso contrário, mostramos o erro automaticamente
      toast.error("Ocorreu um erro", {
        description: getErrorMessage(error),
      });
    },
  }),
});
