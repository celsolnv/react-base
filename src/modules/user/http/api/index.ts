import { handleReq } from "@/lib/axios/handle";
import type { IPagination } from "@/types";
import type { IUser } from "@/types/IUser";
import { setFormDataMulti } from "@/utils/submitForm/formData";

import type { TCreateUserSchema } from "../../create/create-user-schema";
import type { TUserListSchema } from "../../list/schema";
import type { IStaffDetails } from "../../types";
import type { TUpdateUserSchema } from "../../update/schema";

const url = "/private/staff";

export const list = async (
  params: TUserListSchema
): Promise<IPagination<IStaffDetails>> =>
  handleReq({
    url: `${url}/index`,
    method: "get",
    query: {
      limit: params.limit,
      page: params.page,
      search: params.search,
      is_active: params.is_active === "all" ? undefined : params.is_active,
      sector_id: params.sector_id?.join(","),
    },
  });

export const show = async (id: string): Promise<IUser> =>
  handleReq({
    url: `${url}/show/${id}`,
    method: "get",
  });

export const create = async (data: TCreateUserSchema): Promise<IUser> =>
  handleReq({
    url: `${url}/store`,
    method: "post",
    body: setFormDataMulti(data, [
      "profile_picture",
      "identity_docs",
      "residence_docs",
      "other_attachments",
    ]),
    showSuccess: true,
    successMessage: "Usuário criado com sucesso!",
  });

export const update = async (
  data: TUpdateUserSchema,
  id: string
): Promise<IUser> =>
  handleReq({
    url: `${url}/update/${id}`,
    method: "put",
    body: setFormDataMulti(data, [
      "profile_picture",
      "identity_docs",
      "residence_docs",
      "other_attachments",
    ]),
    showSuccess: true,
    successMessage: "Usuário atualizado com sucesso!",
  });

export const destroy = async (id: string): Promise<void> =>
  handleReq({
    url: `${url}/destroy/${id}`,
    method: "delete",
    showSuccess: true,
    successMessage: "Usuário excluído com sucesso!",
  });

export const toggleStatus = async (id: string): Promise<void> =>
  handleReq({
    url: `${url}/toggle_status/${id}`,
    method: "patch",
  });

export const importUsers = async (data: FormData): Promise<void> =>
  handleReq({
    url: `${url}/import`,
    method: "post",
    body: setFormDataMulti(data, ["file"]),
    showSuccess: true,
    successMessage: "Usuários importados com sucesso!",
  });

export const deleteAttachment = async (id: string): Promise<void> =>
  handleReq({
    url: `${url}/delete_attachment/${id}`,
    method: "delete",
    showSuccess: true,
    successMessage: "Anexo excluído com sucesso!",
  });

export const deleteProfilePicture = async (id: string): Promise<void> =>
  handleReq({
    url: `${url}/${id}/profile_picture`,
    method: "delete",
    showSuccess: true,
    successMessage: "Foto de perfil excluída com sucesso!",
  });
