import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as api from "../api";
import type { TCreateAccessLevelSchema } from "../create/schema";
import { accessLevelKeys } from "../queries";

export function useUpdateAccessLevelMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      id,
    }: {
      data: TCreateAccessLevelSchema;
      id: string;
    }) => api.update(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: accessLevelKeys.lists(),
      });
    },
  });
}
