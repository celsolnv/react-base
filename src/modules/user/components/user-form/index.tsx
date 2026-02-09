import { AddressForm } from "@/components/shared";

import { AccessForm } from "./access-form";
import { AttachmentForm } from "./attachment-form";
import { BasicForm } from "./basic-form";
import { FinancialForm } from "./financial-form";
import { HistoryForm } from "./history-form";
import { ProfessionalForm } from "./professional-form";

export function UserForm() {
  return (
    <div className="space-y-4">
      <BasicForm />
      <ProfessionalForm />
      <AccessForm />
      <FinancialForm />
      <AddressForm prefix="address." />
      <HistoryForm />
      <AttachmentForm />
    </div>
  );
}
