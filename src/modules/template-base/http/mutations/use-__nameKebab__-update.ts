import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TUpdate__namePascal__Schema } from "../../update/schema";
import * as api from "../api";
import { __namePascal__Keys } from "../queries";

export default function use__namePascal__UpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      id,
    }: {
      data: TUpdate__namePascal__Schema;
      id: string;
    }) => api.update(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: __namePascal__Keys.lists(),
      });
    },
  });
}
