import { useCallback, useMemo } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import type { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

import { useDataTable } from "@/components/shared";

import useDelete__namePascal__ from "../http/mutations/use-__nameKebab__-delete";
import useToggleStatus__namePascal__ from "../http/mutations/use-__nameKebab__-toggle-status";
import { listQuery } from "../http/queries";
import { getColumns } from "./columns";
import type { TList__namePascal__Schema } from "./schema";

const routeApi = getRouteApi("/_private/{{labelPt}}/");

export const use__namePascal__List = () => {
  const params = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const deps = routeApi.useLoaderDeps();
  const {
    data: { data, ...rest },
  } = useSuspenseQuery(listQuery(deps));

  const deleteMutation = useDelete__namePascal__();
  const toggleStatusMutation = useToggleStatus__namePascal__();

  const handleUpdate = useCallback(
    (id: string) => {
      navigate({
        to: "/__nameKebab__/$__nameKebab___id",
        params: { "__nameKebab___id": id },
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

  const handleParamsChange = (newParams: TList__namePascal__Schema) => {
    navigate({
      search: (old) => ({
        ...old,
        ...newParams,
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
    handleParamsChange,
    table,
    columns,
    totalCount: rest.count,
    params,
  };
};
