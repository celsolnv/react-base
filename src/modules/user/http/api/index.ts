import type { IAsyncComboboxOption } from "@/components/shared";
import { handleReq } from "@/lib/axios/handle";
import type { IPagination } from "@/types";
import type { IAccessProfile } from "@/types/IAcessProfile";
import type { ISector, IUser } from "@/types/IUser";
import { removeFalsyValuesFromObject } from "@/utils/func";
import { setFormDataMulti } from "@/utils/submitForm/formData";

import type { TCreateUserSchema } from "../../constants/create-schema";
import type { TUserListSchema } from "../../constants/list-schema";
import type { TUpdateUserSchema } from "../../constants/update-schema";

const url = "/private/user";

export const list = async (
  params: TUserListSchema
): Promise<IPagination<IUser>> =>
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
    body: setFormDataMulti(removeFalsyValuesFromObject(data), [
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

export const getSectorsOptions = async (
  search: string
): Promise<IAsyncComboboxOption[]> => {
  const response = (await handleReq({
    url: `/private/sectors/index`,
    method: "get",
    query: {
      search,
    },
  })) as IPagination<ISector>;
  if (response?.data) {
    return response?.data?.map((sector) => {
      return {
        id: sector.id,
        label: sector.name,
        value: sector.id,
      };
    });
  }
  return [];
};
export const getJobsRolesOptions = async (
  search: string
): Promise<IAsyncComboboxOption[]> => {
  const response = (await handleReq({
    url: `/private/job_roles/index`,
    method: "get",
    query: {
      search,
    },
  })) as IPagination<ISector>;
  if (response?.data) {
    return response?.data?.map((job) => {
      return {
        id: job.id,
        label: job.name,
        value: job.id,
      };
    });
  }
  return [];
};

export const getAccessProfilesOptions = async (
  search: string
): Promise<IAsyncComboboxOption[]> => {
  const response = (await handleReq({
    url: `/private/access_profiles/index`,
    method: "get",
    query: {
      search,
    },
  })) as IPagination<IAccessProfile>;
  if (response?.data) {
    return response?.data?.map((accessProfile) => {
      return {
        id: accessProfile.id,
        label: accessProfile.name,
        value: accessProfile.id,
      };
    });
  }
  return [];
};
