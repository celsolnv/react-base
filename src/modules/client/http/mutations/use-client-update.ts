import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TUpdateClientPayload } from "../../update/schema";
import * as api from "../api";
import { ClientKeys } from "../queries";

export default function useClientUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, id }: { data: TUpdateClientPayload; id: string }) =>
      api.update(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ClientKeys.lists(),
      });
    },
  });
}
