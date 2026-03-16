import { useMutation } from "@tanstack/react-query";

import * as api from "../api";

export function useDeleteProfilePicture() {
  return useMutation({
    mutationFn: api.deleteProfilePicture,
  });
}
