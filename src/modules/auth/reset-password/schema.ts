import { z } from "zod";

import * as f from "@/constants/schemas";

export const resetPasswordSchema = z
  .object({
    password: f.password,
    password_confirm: f.string("confirmar senha", "a", true),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "As senhas não coincidem",
    path: ["password_confirm"],
  });

export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
