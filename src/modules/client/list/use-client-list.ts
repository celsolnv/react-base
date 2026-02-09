import { useCallback, useMemo } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import type { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

import { useDataTable } from "@/components/shared";

import useDeleteClient from "../http/mutations/use-client-delete";
import useToggleStatusClient from "../http/mutations/use-client-toggle-status";
import { listQuery } from "../http/queries";
import { getColumns } from "./columns";

const routeApi = getRouteApi("/_private/clientes/");

export const useClientList = () => {
  const params = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const deps = routeApi.useLoaderDeps();
  const {
    data: { data, ...rest },
  } = useSuspenseQuery(listQuery(deps));

  const deleteMutation = useDeleteClient();
  const toggleStatusMutation = useToggleStatusClient();

  const handleUpdate = useCallback(
    (id: string) => {
      navigate({
        to: "/clientes/$client_id",
        params: { client_id: id },
      });
    },
    [navigate]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const handleToggleStatus = useCallback(
    (id: string, currentStatus: boolean) => {
      toggleStatusMutation.mutate(id, {
        onSuccess: () => {
          toast.success(
            !currentStatus
              ? "Item ativado com sucesso!"
              : "Item desativado com sucesso!"
          );
        },
        onError: () => {
          toast.error("Erro ao modificar o status do item");
        },
      });
    },
    [toggleStatusMutation]
  );

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: params.page - 1,
      pageSize: params.limit,
    }),
    [params.page, params.limit]
  );

  const handlePageChange = (newPagination: PaginationState) => {
    navigate({
      search: (old) => ({
        ...old,
        page: newPagination.pageIndex + 1, // TanStack usa 0-based, API usa 1-based
        limit: newPagination.pageSize,
      }),
    });
  };

  const handleSearchChange = (newSearch: string) => {
    navigate({
      search: (old) => ({
        ...old,
        search: newSearch,
      }),
    });
  };
  const handleStatusChange = (newStatus: string) => {
    navigate({
      search: (old) => ({
        ...old,
        status: newStatus,
      }),
    });
  };

  const handleTypeChange = (newType: string) => {
    navigate({
      search: (old) => ({
        ...old,
        type: newType,
      }),
    });
  };

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: (profile) => handleUpdate(profile.id),
        onDelete: (profile) => handleDelete(profile.id),
        onDeactivate: (profile) =>
          handleToggleStatus(profile.id, profile.status === "ACTIVE"),
      }),
    [handleUpdate, handleDelete, handleToggleStatus]
  );

  // TanStack Table configurado com dados do controller
  const table = useDataTable({
    data,
    columns,
    pageCount: rest.pages,
    pagination,
    onPaginationChange: handlePageChange,
  });

  return {
    handleSearchChange,
    table,
    columns,
    totalCount: rest.count,
    params,
    handleStatusChange,
    handleTypeChange,
  };
};
