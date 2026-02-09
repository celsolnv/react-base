import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as api from "../api";
import { accessLevelKeys } from "../queries";

export const useToggleStatusAccessLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.toggleStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accessLevelKeys.lists() });
    },
  });
};
