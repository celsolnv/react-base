import { z } from "zod";

import * as f from "@/constants/schemas";

export const resetPasswordSchema = z
  .object({
    password: f.password(true),
    password_confirm: f.string("confirmar senha"),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
