import { useFormContext } from "react-hook-form";

import { User } from "lucide-react";

import { CardForm, InputForm, SelectForm } from "@/components/shared";
import masks from "@/utils/masks";

import {
  clientGenderOptions,
  clientNationalityOptions,
  clientTypeDocumentOptions,
} from "../constants/options";

const PREFIX = "individual_details";
export function IndividualForm() {
  const form = useFormContext();

  return (
    <CardForm
      title="Informações Pessoais"
      icon={<User className="h-4 w-4" />}
      description="Defina as informações pessoais do cliente."
    >
      <InputForm
        label="Nome Completo"
        name={`${PREFIX}.name`}
        className="col-span-12"
        placeholder="Digite o nome completo"
        required
      />
      <SelectForm
        label="Nacionalidade"
        name={`${PREFIX}.is_international`}
        options={clientNationalityOptions}
        className="col-span-6"
        placeholder="Selecione a nacionalidade"
        required
      />

      <SelectForm
        label="Tipo de Documento"
        name={`${PREFIX}.type_document`}
        options={clientTypeDocumentOptions}
        className="col-span-6"
        placeholder="Selecione o tipo de documento"
        required
      />
      <InputForm
        label="Número do Documento"
        name={`${PREFIX}.document`}
        className="col-span-6"
        mask={
          form.watch(`${PREFIX}.type_document`) === "CPF"
            ? masks.cpf
            : undefined
        }
        placeholder="Digite o número do documento"
        required
      />

      <InputForm
        label="Data de Nascimento"
        type="date"
        name={`${PREFIX}.birth_date`}
        className="col-span-6"
        placeholder="Digite a data de nascimento"
        required
      />
      <SelectForm
        label="Sexo"
        name={`${PREFIX}.gender`}
        options={clientGenderOptions}
        className="col-span-6"
        placeholder="Selecione o sexo"
        required
      />
      <InputForm
        label="Profissão"
        name={`${PREFIX}.profession`}
        className="col-span-6"
        placeholder="Digite a profissão"
        required
      />
      {form.watch(`${PREFIX}.nationality`) === "INTERNATIONAL" && (
        <InputForm
          label="PID "
          name={`${PREFIX}.pid`}
          className="col-span-6"
          description="Permissão internacional para dirigir"
          placeholder="Digite o PID"
          required
        />
      )}
    </CardForm>
  );
}
