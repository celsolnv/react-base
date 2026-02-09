// Histórico de Promoções
export interface IPromotionHistory {
  id?: string;
  date: string;
  last_salary: string;
  new_salary: string;
  note: string;
}

export type TPromotionForm = Omit<IPromotionHistory, "id">;

// Histórico de Comissão/PLR
export interface ICommissionHistory {
  id?: string;
  date: string;
  last_commission: string;
  new_commission: string;
  note: string;
}

export type TCommissionForm = Omit<ICommissionHistory, "id">;

// Histórico de Férias
export interface IVacationHistory {
  id?: string;
  start_date: string;
  end_date: string;
  days: number;
  note: string;
}

export type TVacationForm = Omit<IVacationHistory, "id">;

// Histórico Profissional
export interface IProfessionalHistory {
  id?: string;
  company_name: string;
  role: string;
  start_date: string;
  end_date?: string;
  note: string;
}

export type TProfessionalForm = Omit<IProfessionalHistory, "id">;

// Tipo para identificar qual seção está sendo manipulada
export type THistorySection =
  | "promotions"
  | "commissions"
  | "vacations"
  | "professional";
