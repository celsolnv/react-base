import type { IAccessProfile } from "./IAcessProfile";

export interface IUser {
  id: string;
  deleted: boolean;
  deletedAt: string;
  updatedAt: string;
  createdAt: string;
  name: string;
  email: string;
  need_reset: boolean;
  confirmed: boolean;
  confirmed_date: string;
  recovery_date: string;
  confirm_date: string;
  access_profile_id: string;
  birth_date: string;
  is_active: boolean;
  phone: string;
  access_profile: IAccessProfile;
  password?: string;
  permissions?: string[];
  profile_picture?: string;
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
