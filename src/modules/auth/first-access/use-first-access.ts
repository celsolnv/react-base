import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import * as api from "@/modules/auth/http/api";
import { getPasswordRequirements } from "@/utils/validate";

import { useAuth } from "../hooks/use-auth";
import {
  firstAccessSchema,
  type TFirstAccessSchema,
} from "./first-access-schema";

export const useFirstAccess = (code: string) => {
  const hookform = useForm<TFirstAccessSchema>({
    resolver: zodResolver(firstAccessSchema),
  });

  const { signIn } = useAuth();

  const handleSubmit = async (data: TFirstAccessSchema) => {
    try {
      const res = await api.firstAccess({ ...data, code });
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
