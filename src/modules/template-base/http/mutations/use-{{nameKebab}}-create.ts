import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as api from "../api";
import { {{namePascal}}Keys } from "../queries";

export default function use{{namePascal}}Create() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: {{namePascal}}Keys.lists(),
      });
    },
  });
}
