import { AddressForm } from "@/components/shared";

import { AccessForm } from "./access-form";
import { AttachmentForm } from "./attachment-form";
import { BasicForm } from "./basic-form";

export function UserForm() {
  return (
    <div className="space-y-4">
      <BasicForm />
      <AccessForm />
      <AddressForm prefix="address." />
      <AttachmentForm />
    </div>
  );
}
