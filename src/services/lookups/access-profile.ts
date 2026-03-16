import type { IAsyncComboboxOption } from "@/components/shared/form/combobox/async-combobox";
import { handleReq } from "@/lib/axios/handle";
import type { IPagination } from "@/types";
import type { IAccessProfile } from "@/types/IAcessProfile";

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
