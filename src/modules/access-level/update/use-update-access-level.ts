import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi, useNavigate } from "@tanstack/react-router";

import { useUpdateAccessLevelMutation } from "../mutations/use-update-access-level";
import {
  type TUpdateAccessLevelSchema,
  updateAccessLevelSchema,
} from "./schema";

const routeApi = getRouteApi("/_private/nivel-acesso/$access_profile_id");

export const useUpdateAccessLevel = () => {
  const { permissions, accessProfile } = routeApi.useLoaderData();
  const navigate = useNavigate();
  const updateMutation = useUpdateAccessLevelMutation();

  const form = useForm<TUpdateAccessLevelSchema>({
    resolver: zodResolver(updateAccessLevelSchema),
    defaultValues: {
      name: "",
      note: "",
      is_active: true,
      permissions: [],
    },
  });

  useEffect(() => {
    if (accessProfile) {
      const permissionIds = accessProfile.permissions || [];

      form.reset({
        name: accessProfile.name || "",
        note: accessProfile.note || "",
        is_active: accessProfile.is_active ?? true,
        permissions: permissionIds,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessProfile]);

  const isSubmitting = form.formState.isSubmitting || updateMutation.isPending;

  const handleCancel = () => {
    navigate({
      to: "/nivel-acesso",
      search: { limit: 10, page: 1, search: null },
    });
  };

  const handleSubmit = async (data: TUpdateAccessLevelSchema) => {
    if (!accessProfile?.id) return;

    await updateMutation.mutateAsync({
      data,
      id: accessProfile.id,
    });

    navigate({
      to: "/nivel-acesso",
      search: { limit: 10, page: 1, search: null },
    });
  };

  return {
    form,
    isSubmitting,
    handleCancel,
    handleSubmit,
    permissions: permissions?.data || [],
    accessProfile,
  };
};
