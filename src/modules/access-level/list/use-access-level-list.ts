import { useCallback, useMemo } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import type { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

import { useDataTable } from "@/components/shared/data-table/use-data-table";
import { useConfirmStore } from "@/hooks/use-confirm-store";

import { useDeleteAccessLevel } from "../mutations/use-delete-access-level";
import { useToggleStatusAccessLevel } from "../mutations/use-toggle-status-access-level";
import { listQuery } from "../queries";
import { getColumns } from "./columns";
import type { TAccessLevelListSchema } from "./schema";

const routeApi = getRouteApi("/_private/nivel-acesso/");

export const useAccessLevelList = () => {
  const params = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const deps = routeApi.useLoaderDeps();
  const {
    data: { data, ...rest },
  } = useSuspenseQuery(listQuery(deps));
  const confirm = useConfirmStore((state) => state.confirm);

  const deleteMutation = useDeleteAccessLevel();
  const toggleStatusMutation = useToggleStatusAccessLevel();

  const handleUpdate = useCallback(
    (id: string) => {
      navigate({
        to: `/nivel-acesso/$access_profile_id`,
        params: { access_profile_id: id },
      });
    },
    [navigate]
  );

  const handleDelete = useCallback(
    (id: string) => {
      confirm({
        title: "Excluir Nível de Acesso",
        message:
          "Tem certeza que deseja excluir este nível de acesso? Esta ação não pode ser desfeita.",
        variant: "destructive",
      }).then((confirmed) => {
        if (confirmed) {
          deleteMutation.mutate(id);
        }
      });
    },
    [deleteMutation, confirm]
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

  const handleParamsChange = (newParams: TAccessLevelListSchema) => {
    navigate({
      search: (old) => ({
        ...old,
        ...newParams,
        page: 1,
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
