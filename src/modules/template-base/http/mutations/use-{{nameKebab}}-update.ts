import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { TUpdate{{namePascal}}Schema } from "../../update/schema";
import * as api from "../api";
import { {{namePascal}}Keys } from "../queries";

export default function use{{namePascal}}UpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      id,
    }: {
      data: TUpdate{{namePascal}}Schema;
      id: string;
    }) => api.update(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: {{namePascal}}Keys.lists(),
      });
    },
  });
}
