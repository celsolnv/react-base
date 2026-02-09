import { useFormContext } from "react-hook-form";

import { Briefcase } from "lucide-react";

import {
  AsyncComboboxForm,
  CardForm,
  InputForm,
  SelectForm,
} from "@/components/shared";

import { filialOptions } from "../../constants/options";
import * as api from "../../http/api";

export function ProfessionalForm() {
  const form = useFormContext();
  return (
    <CardForm
      title="Dados profissionais"
      description="Defina as informações profissionais do usuário."
      icon={<Briefcase className="text-foreground/80 h-5 w-5" />}
    >
      {/* TODO: Setores e cargos devem ser buscados via API */}
      <AsyncComboboxForm
        fetchOptions={async (query) => {
          return await api.getSectorsOptions(query);
        }}
        control={form.control}
        name="sector_id"
        label="Setor"
        placeholder="Setor"
        fallbackOption={form.watch("sector")}
        className="col-span-12 sm:col-span-6"
        required
      />
      <AsyncComboboxForm
        fetchOptions={async (query) => {
          return await api.getJobsRolesOptions(query);
        }}
        fallbackOption={form.watch("job_role")}
        control={form.control}
        name="job_role_id"
        label="Cargo"
        placeholder="Cargo"
        className="col-span-12 sm:col-span-6"
        required
      />

      <SelectForm
        control={form.control}
        label="Filial"
        name="filial"
        options={filialOptions}
        placeholder="Filial"
        className="col-span-12 sm:col-span-6"
      />
      <InputForm
        control={form.control}
        label="Data de contratação"
        name="hiring_date"
        type="date"
        placeholder="Data de contratação"
        className="col-span-12 sm:col-span-6"
        required
      />
    </CardForm>
  );
}
