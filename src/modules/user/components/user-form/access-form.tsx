import { useFormContext } from "react-hook-form";

import { Lock } from "lucide-react";

import { CardForm } from "@/components/shared/form/card/card-form";
import { AsyncComboboxForm } from "@/components/shared/form/combobox/async-combobox";
import { InputForm } from "@/components/shared/form/input/input-form";
import { getAccessProfilesOptions } from "@/services/lookups/access-profile";

export function AccessForm() {
  const form = useFormContext();
  return (
    <CardForm
      title="Dados de acesso"
      description="Defina as informações de acesso do usuário."
      icon={<Lock className="text-foreground/80 h-5 w-5" />}
    >
      <InputForm
        control={form.control}
        label="E-mail"
        name="email"
        type="email"
        placeholder="E-mail"
        autoComplete="username"
        required
        className="col-span-12 sm:col-span-6"
        description="O usuário receberá uma senha temporária para acessar o sistema por essa e-mail."
      />
      <AsyncComboboxForm
        fetchOptions={async (query: string) => {
          return await getAccessProfilesOptions(query);
        }}
        fallbackOption={form.watch("access_profile")}
        control={form.control}
        name="access_profile_id"
        label="Nível de acesso"
        placeholder="Nível de acesso"
        className="col-span-12 sm:col-span-6"
        required
      />
    </CardForm>
  );
}
