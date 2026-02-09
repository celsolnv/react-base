import { useFormContext } from "react-hook-form";

import { Lock } from "lucide-react";

import {
  AsyncComboboxForm,
  CardForm,
  InputForm,
  InputPasswordForm,
} from "@/components/shared";

import * as api from "../../http/api";
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
      />
      <InputPasswordForm
        control={form.control}
        label="Senha"
        name="password"
        placeholder="Senha"
        autoComplete="new-password"
        required
        className="col-span-12 sm:col-span-6"
      />
      <AsyncComboboxForm
        fetchOptions={async (query: string) => {
          return await api.getAccessProfilesOptions(query);
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
