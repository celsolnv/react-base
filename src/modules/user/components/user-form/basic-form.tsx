import { useFormContext } from "react-hook-form";

import { getRouteApi } from "@tanstack/react-router";
import { User } from "lucide-react";

import { CardForm } from "@/components/shared/form/card/card-form";
import { InputForm } from "@/components/shared/form/input/input-form";
import { InputPhone } from "@/components/shared/form/input/input-phone";
import { ProfilePhotoForm } from "@/components/shared/form/profile-photo";
import { SelectForm } from "@/components/shared/form/select/select-form";
import masks from "@/utils/masks";

import { documentTypeOptions } from "../../constants/options";
import { useDeleteProfilePicture } from "../../http/mutations/use-delete-profile-picture";

const routeApi = getRouteApi("/_private/usuarios/$user_id");

export function BasicForm() {
  const form = useFormContext();
  const deleteProfilePictureMutation = useDeleteProfilePicture();

  // Tenta pegar o user_id da rota (apenas em modo update)
  let userId: string | undefined;
  try {
    const loaderData = routeApi.useLoaderData();
    userId = loaderData.user?.id;
  } catch {
    // Não está na rota de update, userId fica undefined
    userId = undefined;
  }

  const handleDeleteExistingFile = async () => {
    if (!userId) return;
    await deleteProfilePictureMutation.mutateAsync(userId);
  };

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
        onDeleteExistingFile={userId ? handleDeleteExistingFile : undefined}
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
        label="Tipo de documento"
        name="document_type"
        options={documentTypeOptions}
        placeholder="Tipo de documento"
        required
        className="col-span-12 sm:col-span-4"
      />
      <InputForm
        label="Número do documento"
        name="document"
        placeholder="Número do documento"
        className="col-span-12 sm:col-span-8"
        mask={form.watch("document_type") === "CPF" ? masks.cpf : masks.cnpj}
        disabled={!form.watch("document_type")}
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
      <InputPhone
        label="Telefone"
        name="phone"
        placeholder="Telefone"
        required
        className="col-span-12 sm:col-span-6"
      />
    </CardForm>
  );
}
