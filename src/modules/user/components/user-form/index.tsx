import { AddressForm } from "@/components/shared/form/address-form";

import { AccessForm } from "./access-form";
import { AttachmentsForm } from "./attachment-form";
import { BasicForm } from "./basic-form";

export function UserForm() {
  return (
    <div className="space-y-4">
      <BasicForm />
      <AccessForm />
      <AddressForm prefix="address." />
      <AttachmentsForm />
    </div>
  );
}
