import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import * as api from "./api";
import { forgotPasswordSchema, type TForgotPasswordSchema } from "./schema";

export function useForgotPassword() {
  const hookform = useForm<TForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleSubmit = async (data: TForgotPasswordSchema) => {
    try {
      await api.forgotPassword(data);
    } catch (error) {
      console.error(error);
    }
  };
  return {
    hookform,
    handleSubmit,
  };
}
