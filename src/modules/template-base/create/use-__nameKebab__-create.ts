import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import useCreate__namePascal__Mutation from "../http/mutations/use-__nameKebab__-create";
import {
  create__namePascal__Schema,
  type TCreate__namePascal__Schema,
} from "./schema";

export const useCreate__namePascal__ = () => {
  const navigate = useNavigate();

  const createMutation = useCreate__namePascal__Mutation();

  const form = useForm<TCreate__namePascal__Schema>({
    resolver: zodResolver(create__namePascal__Schema),
    defaultValues: {
      name: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleBack = () => {
    navigate({
      to: "/{{labelPt}}",
      search: { limit: 10, page: 1, search: "", is_active: "all" },
    });
  };

  const handleCancel = () => {
    handleBack();
  };

  const handleSubmit = async (data: TCreate__namePascal__Schema) => {
    try {
      await createMutation.mutateAsync(data, {
        onSuccess: () => {
          handleBack();
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado ao criar {{labelPt}}");
    }
  };

  return {
    form,
    isSubmitting,
    handleCancel,
    handleSubmit,
  };
};
