import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi, useNavigate } from "@tanstack/react-router";

import use__namePascal__UpdateMutation from "../http/mutations/use-__nameKebab__-update";
import {
  type TUpdate__namePascal__Schema,
  update__namePascal__Schema,
} from "./schema";

const routeApi = getRouteApi("/_private/{{labelPt}}/$__nameKebab___id");

export const useUpdate__namePascal__ = () => {
  const __nameKebab__ = routeApi.useLoaderData();
  const navigate = useNavigate();
  const updateMutation = use__namePascal__UpdateMutation();

  const form = useForm<TUpdate__namePascal__Schema>({
    resolver: zodResolver(update__namePascal__Schema),
  });

  useEffect(() => {
    if (__nameKebab__) {
      form.reset({
        ...(__nameKebab__ as TUpdate__namePascal__Schema),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [__nameKebab__]);

  const isSubmitting = form.formState.isSubmitting || updateMutation.isPending;

  const handleBack = () => {
    navigate({
      to: "/{{labelPt}}",
      search: { limit: 10, page: 1, search: "", is_active: "all" },
    });
  };

  const handleCancel = () => {
    handleBack();
  };

  const handleSubmit = async (data: TUpdate__namePascal__Schema) => {
    if (!__nameKebab__?.id) return;

    await updateMutation.mutateAsync(
      {
        data,
        id: __nameKebab__.id,
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
