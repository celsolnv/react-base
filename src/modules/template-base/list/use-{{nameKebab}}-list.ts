import { useCallback, useMemo } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import type { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

import { useDataTable } from "@/components/shared";

import  useDelete{{namePascal}} from "../http/mutations/use-{{nameKebab}}-delete";
import  useToggleStatus{{namePascal}} from "../http/mutations/use-{{nameKebab}}-toggle-status";
import { listQuery } from "../http/queries";
import { getColumns } from "./columns";

const routeApi = getRouteApi("/_private/{{labelPt}}/");

export const use{{namePascal}}List = () => {
  const params = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const deps = routeApi.useLoaderDeps();
  const {
    data: { data, ...rest },
  } = useSuspenseQuery(listQuery(deps));

  const deleteMutation = useDelete{{namePascal}}();
  const toggleStatusMutation = useToggleStatus{{namePascal}}();

  const handleUpdate = useCallback(
    (id: string) => {
      navigate({
        to: "/{{nameKebab}}/${{nameKebab}}_id",
        params: { "{{nameKebab}}_id": id },
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
        is_active: newStatus,
      }),
    });
  };

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: (profile) => handleUpdate(profile.id),
        onDelete: (profile) => handleDelete(profile.id),
        onDeactivate: (profile) =>
          handleToggleStatus(profile.id, profile.is_active),
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
  };
};
