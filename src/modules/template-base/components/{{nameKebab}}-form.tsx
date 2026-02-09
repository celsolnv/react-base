import { useFormContext } from "react-hook-form";

import { CardForm, InputForm } from "@/components/shared";
import {  Form, User } from "lucide-react";
import { namePascal } from "../create/schema";

export function {{namePascal}}Form() {
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
