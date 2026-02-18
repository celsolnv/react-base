import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as api from "../api";
import { __namePascal__Keys } from "../queries";

export default function use__namePascal__ToggleStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.toggleStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: __namePascal__Keys.lists() });
    },
  });
}
