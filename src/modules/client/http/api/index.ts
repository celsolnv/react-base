import { handleReq } from "@/lib/axios/handle";
import type { IPagination } from "@/types";
import { removeFalsyValuesFromObject } from "@/utils/func";

import type { TCreateClientPayload } from "../../create/schema";
import type { TClientListSchema } from "../../list/schema";
import type { IClient } from "../../types";
import type { TUpdateClientPayload } from "../../update/schema";

const url = "/private/clients";

export const list = async (
  params: TClientListSchema
): Promise<IPagination<IClient>> =>
  handleReq({
    url: `${url}/index`,
    method: "get",
    query: {
      limit: params.limit,
      page: params.page,
      search: params.search,
      type: params.type === "all" ? undefined : params.type,
      status: params.status === "all" ? undefined : params.status,
    },
  });

export const show = async (id: string): Promise<IClient> =>
  handleReq({
    url: `${url}/show/${id}`,
    method: "get",
  });

export const create = async (data: TCreateClientPayload): Promise<IClient> =>
  handleReq({
    url: `${url}/store`,
    method: "post",
    body: removeFalsyValuesFromObject(data),
    showSuccess: true,
    successMessage: "Perfil de acesso criado com sucesso!",
  });

export const update = async (
  data: TUpdateClientPayload,
  id: string
): Promise<IClient> =>
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
