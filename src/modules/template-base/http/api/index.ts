import type { TGenericListSchema } from "@/constants/schemas/list";
import { handleReq } from "@/lib/axios/handle";
import type { IPagination } from "@/types";
import { removeFalsyValuesFromObject } from "@/utils/func";

import type { TCreate__namePascal__Schema } from "../../create/schema";
import type { I__namePascal__ } from "../../types";
import type { TUpdate__namePascal__Schema } from "../../update/schema";

const url = "/private/__nameKebab__s";

export const list = async (
  params: TGenericListSchema
): Promise<IPagination<I__namePascal__>> =>
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

export const show = async (id: string): Promise<I__namePascal__> =>
  handleReq({
    url: `${url}/show/${id}`,
    method: "get",
  });

export const create = async (
  data: TCreate__namePascal__Schema
): Promise<I__namePascal__> =>
  handleReq({
    url: `${url}/store`,
    method: "post",
    body: removeFalsyValuesFromObject(data),
    showSuccess: true,
    successMessage: "{{labelPt}} criado com sucesso!",
  });

export const update = async (
  data: TUpdate__namePascal__Schema,
  id: string
): Promise<I__namePascal__> =>
  handleReq({
    url: `${url}/update/${id}`,
    method: "put",
    body: removeFalsyValuesFromObject(data),
    showSuccess: true,
    successMessage: "{{labelPt}} atualizado com sucesso!",
  });

export const destroy = async (id: string): Promise<void> =>
  handleReq({
    url: `${url}/destroy/${id}`,
    method: "delete",
    showSuccess: true,
    successMessage: "{{labelPt}} excluído com sucesso!",
  });

export const toggleStatus = async (id: string): Promise<void> =>
  handleReq({
    url: `${url}/toggle_status/${id}`,
    method: "patch",
  });
