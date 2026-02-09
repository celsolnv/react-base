import { z } from "zod";

export const createAccessLevelSchema = z.object({
  name: z
    .string()
    .min(1, "O nome do perfil é obrigatório")
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  note: z.string().optional(),
  is_active: z.boolean(),
  permissions: z
    .array(z.string())
    .min(1, "Selecione pelo menos uma permissão para este perfil"),
});

export type TCreateAccessLevelSchema = z.infer<typeof createAccessLevelSchema>;
