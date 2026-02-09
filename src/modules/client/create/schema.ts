import { z } from "zod";

import * as f from "@/constants/schemas";

export const createClientSchema = z.object({
  type: z.enum(["INDIVIDUAL", "CORPORATE", "PARTNER"], {
    message: "Tipo de cliente inválido",
  }),
  email: f.email("Email"),
  password: f.password,
  phone: f.phone("Telefone"),
  address: z.object({
    street: f.string("Rua"),
    number: f.string("Número"),
    complement: f.string("Complemento", "o", false),
    neighborhood: f.string("Bairro"),
    city: f.string("Cidade"),
    state: f.string("Estado"),
    zip_code: f.zipCode("CEP"),
    country: f.string("País"),
  }),
  individual_details: z
    .object({
      name: f.string("Nome"),
      is_international: f.string("Nacionalidade"),
      document: f.string("Documento"),
      type_document: z.enum(["CPF", "PASSPORT"], {
        message: "Tipo de documento inválido",
      }),
      pid: f.string("PID", "o", false),
      birth_date: f.dateNotFuture,
      profession: f.string("Profissão"),
      gender: z.enum(["MALE", "FEMALE", "OTHER"], {
        message: "Gênero inválido",
      }),
    })
    .optional()
    .nullable(),
  corporate_details: z
    .object({
      reason_social: f.string("Razão social"),
      fantasy_name: f.string("Nome fantasia"),
      cnpj: f.cnpj("CNPJ"),
      segment: f.string("Segmento"),
      responsible_name: f.string("Nome do responsável"),
      responsible_phone: f.phone("Telefone do responsável"),
      responsible_email: f.email("Email do responsável"),
      financial_name: f.string("Nome do financeiro"),
      financial_phone: f.phone("Telefone do financeiro"),
      financial_email: f.email("Email do financeiro"),
    })
    .optional()
    .nullable(),
  partner_details: z
    .object({
      category: f.select("Categoria de parceiro"),
      reason_social: f.string("Razão social"),
      fantasy_name: f.string("Nome fantasia"),
      cnpj: f.cnpj("CNPJ"),
      responsible_name: f.string("Nome do responsável"),
      responsible_phone: f.phone("Telefone do responsável"),
      responsible_email: f.email("Email do responsável"),
      financial_name: f.string("Nome do financeiro"),
      financial_phone: f.phone("Telefone do financeiro"),
      financial_email: f.email("Email do financeiro"),
    })
    .optional()
    .nullable(),
});

export type TCreateClientSchema = z.infer<typeof createClientSchema>;

// Tipo para enviar à API (com is_international como boolean)
export type TCreateClientPayload = Omit<
  TCreateClientSchema,
  "individual_details"
> & {
  individual_details?:
    | (Omit<
        NonNullable<TCreateClientSchema["individual_details"]>,
        "is_international"
      > & {
        is_international: boolean;
      })
    | null;
};
