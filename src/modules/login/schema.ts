import z from "zod";

import * as f from "@/constants/schemas";

export const loginSchema = z.object({
  email: f.email("E-mail"),
  password: f.string("Senha"),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
