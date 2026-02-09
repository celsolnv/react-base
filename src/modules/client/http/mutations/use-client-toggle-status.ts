import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as api from "../api";
import { ClientKeys } from "../queries";

export default function useClientToggleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.toggleStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ClientKeys.lists() });
    },
  });
}
