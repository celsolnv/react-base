import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as api from "../api";
import { ClientKeys } from "../queries";

export default function useClientCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ClientKeys.lists(),
      });
    },
  });
}
