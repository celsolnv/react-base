import { ShieldPlus } from "lucide-react";

import {
  DataTable,
  DataTablePagination,
  HeaderList,
  InputSearch,
} from "@/components/shared";
import { SelectStatus } from "@/components/shared/select/select-status";

import { useAccessLevelList } from "./use-access-level-list";

export default function AccessLevelListPage() {
  const {
    table,
    columns,
    totalCount,
    params,
    handleSearchChange,
    handleStatusChange,
  } = useAccessLevelList();
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-6">
        {/* Header - Fixo */}
        <HeaderList
          title="Níveis de Acesso"
          description="Gerencie os perfis de acesso e suas permissões"
          buttonText="Novo Perfil"
          buttonIcon={<ShieldPlus className="mr-2 h-4 w-4" />}
          buttonLink="/nivel-acesso/criar"
        />
        <div className="border-border bg-card shadow-card flex h-full flex-col overflow-hidden rounded-lg border">
          {/* Filtros e Busca */}
          <div className="bg-secondary/30 border-border flex shrink-0 items-center gap-4 border-b p-4">
            <InputSearch
              search={params.search ?? ""}
              handleSearchChange={handleSearchChange}
            />
            <SelectStatus
              value={params.is_active ?? "all"}
              onValueChange={handleStatusChange}
            />
          </div>

          {/* Tabela */}
          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
            <DataTable table={table} columns={columns} isLoading={false} />
            <DataTablePagination table={table} totalCount={totalCount} />
          </div>
        </div>
      </div>
    </div>
  );
}
