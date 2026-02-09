import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";

import  useCreate{{namePascal}}Mutation from "../http/mutations/use-{{nameKebab}}-create";
import {
  create{import type { Mutation } from "@tanstack/react-query";
    import { data } from "framer-motion/client";
    import { type } from "os";
    import type { Schema } from "zod";
    import type { TCreate } from "../update/schema";
    import type { TCreate } from "./schema";
{namePascal}}Schema,
  type TCreate{{namePascal}}Schema,
} from "./schema";

export const useCreate{{namePascal}} = () => {
  const navigate = useNavigate();

  const createMutation = useCreate{{namePascal}}Mutation();

  const form = useForm<TCreate{{namePascal}}Schema>({
    resolver: zodResolver(create{{namePascal}}Schema),
    defaultValues: {
      name: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleCancel = () => {
    navigate({
      to: "/{{labelPt}}",
    });
  };

  const handleSubmit = async (data: TCreate{{namePascal}}Schema) => {
    await createMutation.mutateAsync(data, {
      onSuccess: () => {
        navigate({
          to: "/{{labelPt}}",
          search: { limit: 10, page: 1, search: null, is_active: "all" },
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
