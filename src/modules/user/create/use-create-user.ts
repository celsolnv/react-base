import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";

import {
  createUserSchema,
  type TCreateUserSchema,
} from "../constants/create-schema";
import { useCreateUserMutation } from "../http/mutations/use-create-user";

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

  const handleCancel = () => {
    navigate({
      to: "/usuarios",
      search: { limit: 10, page: 1, search: "", is_active: "all" },
    });
  };

  const handleSubmit = async (data: TCreateUserSchema) => {
    await createMutation.mutateAsync(data, {
      onSuccess: () => {
        navigate({
          to: "/usuarios",
          search: { limit: 10, page: 1, search: "", is_active: "all" },
        });
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
