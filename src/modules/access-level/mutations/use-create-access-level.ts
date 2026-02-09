import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as api from "../api";
import { accessLevelKeys } from "../queries";

export function useCreateAccessLevelMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: accessLevelKeys.lists(),
      });
    },
  });
}
