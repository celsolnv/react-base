import type { IAccessProfile } from "./IAcessProfile";

export interface IUser {
  id: string;
  deleted: boolean;
  deletedAt: string;
  updatedAt: string;
  createdAt: string;
  name: string;
  email: string;
  active: boolean;
  need_reset: boolean;
  confirmed: boolean;
  confirmed_date: string;
  recovery_date: string;
  confirm_date: string;
  access_profile_id: string;
  birth_date: string;
  commission_periodicity: string;
  commission_type: string;
  commission_value: string;
  commission_value_type: string;
  document: string;
  document_type: string;
  filial: string;
  hiring_date: string;
  is_active: boolean;
  phone: string;
  job_role_id: string;
  sector_id: string;
  salary: string;
  user_addresses: IUserAddresses;
  access_profile: IAccessProfile;
  job_role: IJobRole;
  sector: ISector;
  benefits?: IBenefit[];
  user_vacation_histories?: IUserVacationHistory[];
  user_commission_histories?: IUserCommissionHistory[];
  user_promotion_histories?: IUserPromotionHistory[];
  user_professional_histories?: IUserProfessionalHistory[];
  user_attachments?: IUserAttachment[];
  password?: string;
}
export interface IUserToken {
  id: string;
  deleted: boolean;
  deletedAt: string;
  updatedAt: string;
  createdAt: string;
  user_id: string;
  token: string;
  device_id: string;
}
export interface IJobRole {
  id: string;
  name: string;
  note: string;
  is_active: boolean;
}
export interface ISector {
  id: string;
  name: string;
  note: string;
  is_active: boolean;
}
export interface IUserAddresses {
  id: string;
  deleted: boolean;
  deletedAt: string;
  updatedAt: string;
  createdAt: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  user_id: string;
  street: string;
}
export interface IBenefit {
  id: string;
  deleted: boolean;
  deletedAt: string;
  updatedAt: string;
  createdAt: string;
  name: string;
  value: string;
  is_active: boolean;
  frequency: string;
  user_id: string;
}

export interface IUserVacationHistory {
  id: string;
  deleted: boolean;
  deletedAt: string;
  updatedAt: string;
  createdAt: string;
  user_id: string;
  note: string;
  start_date: string;
  end_date: string;
  days: number;
}

export interface IUserCommissionHistory {
  id: string;
  deleted: boolean;
  deletedAt: string;
  updatedAt: string;
  createdAt: string;
  user_id: string;
  note: string;
  date: string;
  last_commission: string;
  new_commission: string;
}

export interface IUserPromotionHistory {
  id: string;
  deleted: boolean;
  deletedAt: string;
  updatedAt: string;
  createdAt: string;
  user_id: string;
  note: string;
  last_salary: string;
  new_salary: string;
  date: string;
}

export interface IUserProfessionalHistory {
  id: string;
  deleted: boolean;
  deletedAt: string;
  updatedAt: string;
  createdAt: string;
  user_id: string;
  note: string;
  start_date: string;
  end_date: string;
  company_name: string;
  role: string;
}

export interface IUserAttachment {
  id: string;
  user_id: string;
  type: "PROOF_OF_ADDRESS" | "OTHER" | "DOCUMENT" | "PROFILE_IMAGE";
  key: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;

  deleted: boolean;
  deletedAt: string;
  updatedAt: string;
  createdAt: string;
}
