import { z } from "zod";

import * as f from "@/constants/schemas";

export const createUserSchema = z.object({
  name: f.string("Nome"),
  document_type: f.select("Tipo de documento"),
  document: f.string("Número do documento"),
  birth_date: f.dateNotFuture,
  phone: f.phone("Telefone"),

  sector_id: f.select("Setor"),
  job_role_id: f.select("Cargo"),
  filial: f.select("Filial"),
  hiring_date: f.dateNotFuture,

  email: f.email("E-mail"),
  password: f.password,
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
  benefits: z.array(
    z.object({
      name: f.string("Nome"),
      value: f.money("Valor"),
      frequency: f.select("Recorrência"),
      is_active: f.boolean("Status"),
    })
  ),
  promotions_history: z.array(
    z.object({
      date: f.date("Data"),
      last_salary: f.money("Valor"),
      new_salary: f.money("Valor"),
      note: f.text("Observações"),
    })
  ),
  commission_history: z.array(
    z.object({
      date: f.date("Data"),
      last_commission: f.money("Valor"),
      new_commission: f.money("Valor"),
      note: f.text("Observações"),
    })
  ),
  vacations_history: z.array(
    z.object({
      start_date: f.date("Data de início"),
      end_date: f.date("Data de fim"),
      days: f.numberTransform("Data de fim"),
      note: f.text("Observações"),
    })
  ),
  professional_history: z.array(
    z.object({
      company_name: f.string("Nome da empresa"),
      role: f.string("Cargo"),
      start_date: f.date("Data de início"),
      end_date: f.date("Data de fim").optional().nullable(),
      note: f.text("Observações"),
    })
  ),
  profile_picture: z.any().optional(),
  identity_docs: z.any().optional(),
  residence_docs: z.any().optional(),
  other_attachments: z.any().optional(),
  // identity_docs: f.fileAttachmentArray("Documentos de identidade"),
  // residence_docs: f.fileAttachmentArray("Comprovantes de residência"),
  // other_attachments: f.fileAttachmentArray("Outros anexos"),

  // Fake fields
  sector: z.any(),
  job_role: z.any(),
  access_profile: z.any(),
});

export type TCreateUserSchema = z.infer<typeof createUserSchema>;
