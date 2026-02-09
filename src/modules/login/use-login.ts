import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { CustomError } from "@/lib/axios/handle";
import { useAuth } from "@/modules/auth/hooks/use-auth";

import * as api from "./api";
import { loginSchema, type TLoginSchema } from "./schema";

export const useLogin = () => {
  const hookform = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const { signIn } = useAuth();

  async function handleSubmit(data: TLoginSchema) {
    try {
      const res = await api.auth(data);
      signIn(res);
    } catch (error) {
      if (error instanceof CustomError) {
        const data = error.data as { message: string; status: number };
        if (data.status === 403 || data.status === 429) {
          hookform.setError("password", {
            type: "manual",
            message: "E-mail ou senha inválidos",
          });
        }
      }
    }
    return data;
  }

  return {
    hookform,
    handleSubmit,
  };
};
