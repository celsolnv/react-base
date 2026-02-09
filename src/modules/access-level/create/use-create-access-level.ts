import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi, useNavigate } from "@tanstack/react-router";

import { useCreateAccessLevelMutation } from "../mutations/use-create-access-level";
import {
  createAccessLevelSchema,
  type TCreateAccessLevelSchema,
} from "./schema";

const routeApi = getRouteApi("/_private/nivel-acesso/criar");

export const useCreateAccessLevel = () => {
  const { permissions } = routeApi.useLoaderData();
  const navigate = useNavigate();

  const createMutation = useCreateAccessLevelMutation();

  const form = useForm<TCreateAccessLevelSchema>({
    resolver: zodResolver(createAccessLevelSchema),
    defaultValues: {
      name: "",
      note: "",
      is_active: true,
      permissions: [],
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleCancel = () => {
    navigate({
      to: "/nivel-acesso",
      search: { limit: 10, page: 1, search: null },
    });
  };

  const handleSubmit = async (data: TCreateAccessLevelSchema) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate({
          to: "/nivel-acesso",
          search: { limit: 10, page: 1, search: null },
        });
      },
    });
  };

  return {
    form,
    isSubmitting,
    handleCancel,
    handleSubmit,
    permissions: permissions?.data || [],
  };
};
