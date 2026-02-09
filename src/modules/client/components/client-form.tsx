import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { Lock, User } from "lucide-react";

import {
  AddressForm,
  CardForm,
  InputForm,
  InputPasswordForm,
  InputPhone,
  SelectForm,
} from "@/components/shared";

import { clientTypeOptions } from "../constants/options";
import type { TClientType } from "../types";
import { CorporateForm } from "./corporate-form";
import { IndividualForm } from "./individual-form";
import { PartnerForm } from "./partner-form";

export function ClientForm() {
  const form = useFormContext();
  const [type, setType] = useState<TClientType>(form.watch("type"));

  useEffect(() => {
    // Precisamos resetar o formulário quando o tipo de cliente mudar
    // para que os campos sejam resetados corretamente
    // e não fiquem com valores anteriores
    if (type !== form.watch("type")) {
      setType(form.watch("type"));
      form.reset({
        type: form.watch("type"),
        address: {
          country: "Brasil",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("type")]);

  return (
    <>
      <CardForm
        title="Tipo de Cliente"
        icon={<User className="h-4 w-4" />}
        description="Defina o tipo de cliente."
      >
        <SelectForm
          label="Tipo de Cliente"
          name="type"
          options={clientTypeOptions}
          className="col-span-6"
          required
        />
      </CardForm>

      {form.watch("type") === "INDIVIDUAL" && <IndividualForm />}
      {form.watch("type") === "CORPORATE" && <CorporateForm />}
      {form.watch("type") === "PARTNER" && <PartnerForm />}

      <AddressForm prefix="address." />

      <CardForm
        title="Dados de acesso"
        icon={<Lock className="h-4 w-4" />}
        description="Defina os dados de acesso do cliente."
      >
        <InputForm label="Email" name="email" className="col-span-6" required />
        <InputPasswordForm className="col-span-6" />
        <InputPhone className="col-span-6" required />
      </CardForm>
    </>
  );
}
