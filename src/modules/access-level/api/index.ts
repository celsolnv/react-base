import type { TGenericListSchema } from "@/constants/schemas/list";
import { handleReq } from "@/lib/axios/handle";
import type { IPagination } from "@/types";
import type { IAccessProfile, IPermission } from "@/types/IAcessProfile";
import { removeFalsyValuesFromObject } from "@/utils/func";

import type { TCreateAccessLevelSchema } from "../create/schema";

const url = "/private/access_profiles";

export const create = async (
  data: TCreateAccessLevelSchema
): Promise<IAccessProfile> =>
  handleReq({
    url: `${url}/store`,
    method: "post",
    body: removeFalsyValuesFromObject(data),
    showSuccess: true,
    successMessage: "Perfil de acesso criado com sucesso!",
  });

export const update = async (
  data: TCreateAccessLevelSchema,
  id: string
): Promise<IAccessProfile> =>
  handleReq({
    url: `${url}/update/${id}`,
    method: "put",
    body: removeFalsyValuesFromObject(data),
    showSuccess: true,
    successMessage: "Perfil de acesso atualizado com sucesso!",
  });

export const list = async (
  params: TGenericListSchema
): Promise<IPagination<IAccessProfile>> =>
  handleReq({
    url: `${url}/index`,
    method: "get",
    query: {
      limit: params.limit,
      page: params.page,
      search: params.search,
      is_active: params.is_active === "all" ? undefined : params.is_active,
    },
  });

export const show = async (id: string): Promise<IAccessProfile> =>
  handleReq({
    url: `${url}/show/${id}`,
    method: "get",
  });

export const destroy = async (id: string): Promise<void> =>
  handleReq({
    url: `${url}/destroy/${id}`,
    method: "delete",
    showSuccess: true,
    successMessage: "Item excluído com sucesso!",
  });

export const toggleStatus = async (id: string): Promise<void> =>
  handleReq({
    url: `${url}/toggle_status/${id}`,
    method: "patch",
  });

export const getPermissions = async (): Promise<IPagination<IPermission>> =>
  handleReq({
    url: `/private/access_permissions/index`,
    method: "get",
  });
