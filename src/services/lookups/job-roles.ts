import type { IAsyncComboboxOption } from "@/components/shared/form/combobox/async-combobox";
import { handleReq } from "@/lib/axios/handle";
import type { IJobRole, IPagination } from "@/types";

export const getJobsRolesOptions = async (
  search: string
): Promise<IAsyncComboboxOption[]> => {
  const response = (await handleReq({
    url: `/private/job_roles/index`,
    method: "get",
    query: {
      search,
    },
  })) as IPagination<IJobRole>;
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
