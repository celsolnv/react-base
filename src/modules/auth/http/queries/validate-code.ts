import { queryOptions } from "@tanstack/react-query";

import * as api from "../api";

// Aqui vamos validar o código de recuperação de senha
export const validateCodeQuery = (code: string) =>
  queryOptions({
    queryKey: ["auth", "verify-code", code],
    queryFn: () => api.verifyResetCode(code),
    retry: false,
    staleTime: 0, // Sempre verifica
  });
