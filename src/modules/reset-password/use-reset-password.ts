import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { getPasswordRequirements } from "@/utils/validate";

import { useAuth } from "../auth/hooks/use-auth";
import * as api from "./api";
import { resetPasswordSchema, type TResetPasswordSchema } from "./schema";

export const useResetPassword = (code: string) => {
  const hookform = useForm<TResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { signIn } = useAuth();

  const handleSubmit = async (data: TResetPasswordSchema) => {
    try {
      const res = await api.reset(data, code);
      signIn(res);
    } catch (error) {
      console.error(error);
    }
  };

  const passwordFieldValue = useWatch({
    control: hookform.control,
    name: "password",
  });

  const requirements = useMemo(
    () => getPasswordRequirements(passwordFieldValue || ""),
    [passwordFieldValue]
  );

  return {
    hookform,
    handleSubmit,
    requirements,
  };
};
