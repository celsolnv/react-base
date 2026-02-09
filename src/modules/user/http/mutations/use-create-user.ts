import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as api from "../api";
import { userKeys } from "../queries";

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userKeys.lists(),
      });
    },
  });
}
