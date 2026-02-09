export interface IAccessProfile {
  id: string;
  name: string;
  note: string;
  is_active: boolean;
  permissions?: string[]; // Array de IDs das permissões

  updatedAt: string;
  createdAt: string;
  deletedAt: string;
  deleted: boolean;
}

export interface IPermission {
  id?: string;
  resource?: string;
  slug?: string;
  note?: string;
  name?: string;
  deleted?: boolean;
  deletedAt?: string;
  updatedAt?: string;
  createdAt?: string;
}
