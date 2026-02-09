import type { IGenericAddress } from "@/types/Common";

export type TClientStatus = "ACTIVE" | "INACTIVE" | "DEFAULTER";
export type TClientType = "CORPORATE" | "PARTNER" | "INDIVIDUAL";
export type TClientGender = "MALE" | "FEMALE" | "OTHER";
export interface IClient {
  id: string;
  deleted: boolean;
  deletedAt: string;
  updatedAt: string;
  createdAt: string;
  public_code: number;
  type: TClientType;
  status: TClientStatus;
  email: string;
  phone: string;
  client_corporate_details?: IClientCorporateDetails;
  client_partner_details?: IClientPartnerDetails;
  client_addresses?: IClientAddress[];
  client_individual_details?: IClientIndividualDetails;
}

export interface IClientIndividualDetails {
  id: string;
  deleted: boolean;
  deletedAt: string;
  updatedAt: string;
  createdAt: string;
  client_id: string;
  name: string;
  is_international: boolean;
  document: string;
  pid: string;
  birth_date: string;
  profession: string;
  gender: TClientGender;
}

export interface IClientCorporateDetails {
  id: string;
  deleted: boolean;
  deletedAt: string;
  updatedAt: string;
  createdAt: string;
  client_id: string;
  reason_social: string;
  fantasy_name: string;
  cnpj: string;
  segment: string;
  responsible_name: string;
  responsible_phone: string;
  responsible_email: string;
  financial_name: string;
  financial_phone: string;
  financial_email: string;
}

export interface IClientPartnerDetails {
  id: string;
  deleted: boolean;
  deletedAt: string;
  updatedAt: string;
  createdAt: string;
  client_id: string;
  category: string;
  reason_social: string;
  fantasy_name: string;
  cnpj: string;
  responsible_name: string;
  responsible_phone: string;
  responsible_email: string;
  financial_name: string;
  financial_phone: string;
  financial_email: string;
}

export interface IClientAddress extends IGenericAddress {
  client_id: string;
}
