import { useCallback, useMemo, useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import type { PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

import { useDataTable } from "@/components/shared/data-table/use-data-table";
import { useConfirmStore } from "@/hooks/use-confirm-store";

import { useDeleteUser } from "../http/mutations/use-delete-user";
import { useToggleStatusUser } from "../http/mutations/use-toggle-status-user";
import { listQuery } from "../http/queries";
import { getColumns } from "./columns";

const routeApi = getRouteApi("/_private/usuarios/");

export const useUserList = () => {
  const [openImportModal, setOpenImportModal] = useState(false);
  const params = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const deps = routeApi.useLoaderDeps();
  const {
    data: { data, ...rest },
    refetch,
  } = useSuspenseQuery(listQuery(deps));

  const deleteMutation = useDeleteUser();
  const toggleStatusMutation = useToggleStatusUser();
  const confirm = useConfirmStore((state) => state.confirm);

  const handleUpdate = useCallback(
    (id: string) => {
      navigate({ to: `/usuarios/$user_id`, params: { user_id: id } });
    },
    [navigate]
  );

  const handleDelete = useCallback(
    (id: string) => {
      confirm({
        title: "Excluir Usuário",
        message:
          "Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.",
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
              ? "Usuário ativado com sucesso!"
              : "Usuário desativado com sucesso!"
          );
        },
        onError: () => {
          toast.error("Erro ao modificar o status do usuário");
        },
      });
    },
    [toggleStatusMutation]
  );

  const handleImport = () => {
    setOpenImportModal(true);
  };

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
        page: 1,
      }),
    });
  };
  const handleStatusChange = (newStatus: string) => {
    navigate({
      search: (old) => ({
        ...old,
        is_active: newStatus,
        page: 1,
      }),
    });
  };

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: (staff) => handleUpdate(staff.id),
        onDelete: (staff) => handleDelete(staff.id),
        onDeactivate: (staff) => handleToggleStatus(staff.id, staff.is_active),
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
    handleImport,
    openImportModal,
    setOpenImportModal,
    refetch,
  };
};
