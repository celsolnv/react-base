import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi, useNavigate } from "@tanstack/react-router";

import  use{{namePascal}}UpdateMutation from "../http/mutations/use-{{nameKebab}}-update";
import {
  type TUpdate{{namePascal}}Schema,
  update{{namePascal}}Schema,
} from "./schema";

const routeApi = getRouteApi("/_private/{{labelPt}}/${{nameKebab}}_id");

export const useUpdate{{namePascal}} = () => {
  const {{nameKebab}} = routeApi.useLoaderData();
  const navigate = useNavigate();
  const updateMutation = use{{namePascal}}UpdateMutation();

  const form = useForm<TUpdate{{namePascal}}Schema>({
    resolver: zodResolver(update{{namePascal}}Schema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if ({{nameKebab}}) {
      form.reset({
        ...{{nameKebab}},
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [{{nameKebab}}]);

  const isSubmitting = form.formState.isSubmitting || updateMutation.isPending;

  const handleBack = () => {
    navigate({
      to: "/{{labelPt}}",
    });
  };

  const handleCancel = () => {
    handleBack();
  };

  const handleSubmit = async (data: TUpdate{{namePascal}}Schema) => {
    if (!{{nameKebab}}?.id) return;

    await updateMutation.mutateAsync({
      data,
      id: {{nameKebab}}.id,
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
  };
};
