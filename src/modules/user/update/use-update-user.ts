import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi, useNavigate } from "@tanstack/react-router";

import {
  type TUpdateUserSchema,
  updateUserSchema,
} from "../constants/update-schema";
import { useUpdateUserMutation } from "../http/mutations/use-update-user";
import { formatUserResponse } from "./utils";

const routeApi = getRouteApi("/_private/usuarios/$user_id");

export const useUpdateUser = () => {
  const { user } = routeApi.useLoaderData();
  const navigate = useNavigate();
  const updateMutation = useUpdateUserMutation();

  const form = useForm<TUpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    if (user) {
      const formattedUser = formatUserResponse(user);
      form.reset(formattedUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleBack = () => {
    navigate({
      to: "/usuarios",
      search: { limit: 10, page: 1, search: "", is_active: "all" },
    });
  };
  const isSubmitting = form.formState.isSubmitting || updateMutation.isPending;

  const handleCancel = () => {
    handleBack();
  };

  const handleSubmit = async (data: TUpdateUserSchema) => {
    if (!user?.id) return;
    delete data.sector;
    delete data.job_role;
    delete data.access_profile;

    await updateMutation.mutateAsync(
      {
        data,
        id: user.id,
      },
      {
        onSuccess: () => {
          handleBack();
        },
      }
    );
  };

  return {
    form,
    isSubmitting,
    handleCancel,
    handleSubmit,
    user,
  };
};
