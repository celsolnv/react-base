import { useFormContext } from "react-hook-form";

import { User } from "lucide-react";

import { CardForm, InputForm, SelectForm } from "@/components/shared";
import { ProfilePhotoForm } from "@/components/shared/form/profile-photo";
import masks from "@/utils/masks";

import { documentTypeOptions } from "../../constants/options";

export function BasicForm() {
  const form = useFormContext();
  return (
    <CardForm
      icon={<User className="text-foreground/80 h-5 w-5" />}
      title="Dados do Usuário"
      description="Defina o nome, e-mail e outras informações para este novo usuário."
    >
      <ProfilePhotoForm
        name="profile_picture"
        label="Foto de perfil"
        initials={form.getValues("name")?.charAt(0) || "U"}
        className="col-span-12 sm:col-span-12"
      />
      <InputForm
        control={form.control}
        label="Nome"
        name="name"
        placeholder="Nome do usuário"
        required
        className="col-span-12 sm:col-span-12"
      />
      <SelectForm
        control={form.control}
        label="Tipo de documento"
        name="document_type"
        options={documentTypeOptions}
        placeholder="Tipo de documento"
        required
        className="col-span-12 sm:col-span-4"
      />
      {/* TODO: se for cpf vai ter mascara de cpf e se for cnpj vai ter mascara de cnpj */}
      <InputForm
        control={form.control}
        label="Número do documento"
        name="document"
        placeholder="Número do documento"
        className="col-span-12 sm:col-span-8"
        mask={masks.cpf_cnpj}
        required
      />
      <InputForm
        control={form.control}
        label="Data de nascimento"
        name="birth_date"
        type="date"
        placeholder="Data de nascimento"
        required
        className="col-span-12 sm:col-span-6"
      />
      <InputForm
        control={form.control}
        label="Telefone"
        name="phone"
        type="tel"
        mask={masks.phone}
        placeholder="Telefone"
        required
        className="col-span-12 sm:col-span-6"
      />
    </CardForm>
  );
}
