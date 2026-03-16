import { z } from "zod";

import * as f from "@/constants/schemas";

export const firstAccessSchema = z
  .object({
    password: f.password,
    password_confirm: f.string("confirmar senha"),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "As senhas não coincidem",
    path: ["password_confirm"],
  });

export type TFirstAccessSchema = z.infer<typeof firstAccessSchema>;
