import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";

import useCreateClientMutation from "../http/mutations/use-client-create";
import { createClientSchema, type TCreateClientSchema } from "./schema";

export const useCreateClient = () => {
  const navigate = useNavigate();

  const createMutation = useCreateClientMutation();

  const form = useForm<TCreateClientSchema>({
    resolver: zodResolver(createClientSchema),
    shouldFocusError: true,
    defaultValues: {
      type: "INDIVIDUAL" as const,
      address: {
        country: "Brasil",
      },
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleBack = () => {
    navigate({
      to: "/clientes",
      search: { limit: 10, page: 1, search: "", type: "all", status: "all" },
    });
  };

  const handleCancel = () => {
    handleBack();
  };

  const handleSubmit = async (data: TCreateClientSchema) => {
    // Converte is_international de string para boolean antes de enviar à API
    const transformedData = {
      ...data,
      individual_details: data.individual_details
        ? {
            ...data.individual_details,
            is_international:
              data.individual_details.is_international === "INTERNATIONAL",
          }
        : data.individual_details,
    };

    await createMutation.mutateAsync(transformedData, {
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
