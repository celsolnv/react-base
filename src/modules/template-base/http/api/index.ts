import type { TGenericListSchema } from "@/constants/schemas/list";
import { handleReq } from "@/lib/axios/handle";
import type { IPagination } from "@/types";
import type { IAccessProfile } from "@/types/IAcessProfile";
import { removeFalsyValuesFromObject } from "@/utils/func";

import type { TCreate{{namePascal}}Schema } from "../../create/schema";
import type { TUpdate{{namePascal}}Schema } from "../../update/schema";

const url = "/private/{{nameKebab}}s";

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

export const create = async (
  data: TCreate{{namePascal}}Schema
): Promise<IAccessProfile> =>
  handleReq({
    url: `${url}/store`,
    method: "post",
    body: removeFalsyValuesFromObject(data),
    showSuccess: true,
    successMessage: "Perfil de acesso criado com sucesso!",
  });

export const update = async (
  data: TUpdate{{namePascal}}Schema,
  id: string
): Promise<IAccessProfile> =>
  handleReq({
    url: `${url}/update/${id}`,
    method: "put",
    body: removeFalsyValuesFromObject(data),
    showSuccess: true,
    successMessage: "Perfil de acesso atualizado com sucesso!",
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
