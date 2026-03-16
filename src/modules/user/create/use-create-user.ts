import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";

import { useCreateUserMutation } from "../http/mutations/use-create-user";
import { createUserSchema, type TCreateUserSchema } from "./create-user-schema";

export const useCreateUser = () => {
  const navigate = useNavigate();

  const createMutation = useCreateUserMutation();

  const form = useForm<TCreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      address: {
        country: "Brasil",
      },
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleBack = () => {
    navigate({
      to: "/usuarios",
      search: { limit: 10, page: 1, search: "", is_active: "all" },
    });
  };

  const handleCancel = () => {
    handleBack();
  };

  const handleSubmit = async (data: TCreateUserSchema) => {
    await createMutation.mutateAsync(data, {
      onSuccess: () => {
        handleBack();
      },
    });
  };

  return {
    form,
    isSubmitting,
    handleCancel,
    handleSubmit,
  };
};
