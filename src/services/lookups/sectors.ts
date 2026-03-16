import type { IAsyncComboboxOption } from "@/components/shared/form/combobox/async-combobox";
import { handleReq } from "@/lib/axios/handle";
import type { IPagination, ISector } from "@/types";

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
