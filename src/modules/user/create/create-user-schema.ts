import { z } from "zod";

import * as f from "@/constants/schemas";

export const createUserSchema = z.object({
  name: f.string("Nome"),
  document_type: f.select("Tipo de documento"),
  document: f.string("Número do documento"),
  birth_date: f.dateNotFuture,
  phone: f.phone("Telefone"),

  email: f.email("E-mail"),
  access_profile_id: f.select("Perfil de acesso"),

  salary: f.money("Salário"),
  commission_type: f.select("Tipo de comissão"),
  // Opcionais caso commission_type seja "None"
  commission_value_type: f.select("Tipo de valor", "o", false),
  commission_value: f.money("Valor da comissão/PLR", false),
  commission_periodicity: f.select("Período de comissão", "o", false),

  address: z.object({
    street: f.string("Rua", "a"),
    number: f.string("Número", "o", false),
    complement: f.string("Complemento", "o", false),
    neighborhood: f.string("Bairro"),
    city: f.string("Cidade", "a"),
    state: f.string("Estado"),
    zip_code: f.zipCode("CEP"),
    country: f.string("País"),
  }),

  profile_picture: z.any().optional(),
  identity_docs: f.fileArray("Documentos de identidade"),
  residence_docs: f.fileArray("Comprovantes de residência"),
  other_attachments: f.fileArray("Outros anexos"),
});

export type TCreateUserSchema = z.infer<typeof createUserSchema>;
