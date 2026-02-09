import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as api from "../api";
import { accessLevelKeys } from "../queries";

export function useDeleteAccessLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.destroy,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: accessLevelKeys.lists(),
      });
    },
  });
}
