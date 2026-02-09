import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TUpdateUserSchema } from "../../constants/update-schema";
import * as api from "../api";
import { userKeys } from "../queries";

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, id }: { data: TUpdateUserSchema; id: string }) =>
      api.update(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });
    },
  });
}
