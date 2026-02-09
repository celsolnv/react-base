export interface IBenefit {
  id?: string;
  name: string;
  value: string;
  frequency: "monthly" | "yearly" | "once";
  is_active: boolean;
}

export type TBenefitForm = Omit<IBenefit, "is_active">;
