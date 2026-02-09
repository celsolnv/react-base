import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { getRouteApi, useNavigate } from "@tanstack/react-router";

import { formatDateISO } from "@/utils/formatters/date";
import masks from "@/utils/masks";

import useClientUpdateMutation from "../http/mutations/use-client-update";
import { type TUpdateClientSchema, updateClientSchema } from "./schema";

const routeApi = getRouteApi("/_private/clientes/$client_id");

export const useUpdateClient = () => {
  const client = routeApi.useLoaderData();
  const navigate = useNavigate();
  const updateMutation = useClientUpdateMutation();

  const form = useForm<TUpdateClientSchema>({
    resolver: zodResolver(updateClientSchema),
  });

  useEffect(() => {
    if (client) {
      form.reset({
        ...client,
        address: {
          ...client.client_addresses?.[0],
          country: "Brasil",
          zip_code: masks.cep(client.client_addresses?.[0]?.zip_code ?? ""),
        },
        individual_details: client.client_individual_details
          ? {
              ...client.client_individual_details,
              birth_date: formatDateISO(
                client.client_individual_details?.birth_date
              ),
              type_document: "CPF",
              document: masks.cpf(
                client.client_individual_details?.document ?? ""
              ),
              is_international: client.client_individual_details
                ?.is_international
                ? "INTERNATIONAL"
                : "NATIONAL",
            }
          : null,
        corporate_details: client.client_corporate_details
          ? {
              ...client.client_corporate_details,
              cnpj: masks.cnpj(client.client_corporate_details?.cnpj ?? ""),
            }
          : null,
        partner_details: client.client_partner_details
          ? {
              ...client.client_partner_details,
              cnpj: masks.cnpj(client.client_partner_details?.cnpj ?? ""),
            }
          : null,
        phone: masks.phone(client.phone),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

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

  const handleSubmit = async (data: TUpdateClientSchema) => {
    if (!client?.id) return;

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
    await updateMutation.mutateAsync(
      {
        data: transformedData,
        id: client.id,
      },
      {
        onSuccess: () => {
          handleBack();
        },
      }
    );

    handleBack();
  };

  return {
    form,
    isSubmitting,
    handleCancel,
    handleSubmit,
  };
};
