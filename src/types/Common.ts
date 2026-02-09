export interface IOptionSelect {
  value: string;
  label: string;
}

export interface IGenericObject {
  name: string;
  id: string;
}

export interface IGenericAddress {
  id: string;
  street: string;
  number?: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  country?: string;

  deleted: boolean;
  deletedAt: string;
  updatedAt: string;
  createdAt: string;
}
