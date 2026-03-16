import { useMutation } from "@tanstack/react-query";

import * as api from "../api";

export function useDeleteAttachment() {
  return useMutation({
    mutationFn: api.deleteAttachment,
  });
}
