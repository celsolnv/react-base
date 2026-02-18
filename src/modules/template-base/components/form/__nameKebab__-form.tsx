import { useFormContext } from "react-hook-form";

import { User } from "lucide-react";

import { CardForm, InputForm } from "@/components/shared";

export function __namePascal__Form() {
  const form = useFormContext();
  return (
    <CardForm
      title="Dados básicos"
      icon={<User className="h-4 w-4" />}
      description="Defina os dados básicos do {{labelPt}}."
    >
      <InputForm
        control={form.control}
        label="Nome"
        name="name"
        placeholder="Nome d {{labelPt}}"
        className="col-span-4"
        required
      />
    </CardForm>
  );
}
