import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as api from "../api";
import { __namePascal__Keys } from "../queries";

export default function use__namePascal__Delete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.destroy,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: __namePascal__Keys.lists(),
      });
    },
  });
}
