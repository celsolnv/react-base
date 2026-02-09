import { UserPlus } from "lucide-react";

import {
  DataTable,
  DataTablePagination,
  HeaderList,
  InputSearch,
} from "@/components/shared";
import { SelectGeneric } from "@/components/shared/select/select-generic";

import { clientStatusOptions, clientTypeOptions } from "../constants/options";
import { useClientList } from "./use-client-list";

export default function ClientListPage() {
  const {
    table,
    columns,
    totalCount,
    params,
    handleSearchChange,
    handleStatusChange,
    handleTypeChange,
  } = useClientList();
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-6">
        {/* Header - Fixo */}
        <HeaderList
          title="Clientes"
          description="Gerencie clientes pessoa física, pessoa jurídica e parceiros estratégicos"
          buttonText="Novo cliente"
          buttonIcon={<UserPlus className="mr-2 h-4 w-4" />}
          buttonLink="/clientes/criar"
        />
        <div className="border-border bg-card shadow-card flex h-full flex-col overflow-hidden rounded-lg border">
          {/* Filtros e Busca */}
          <div className="bg-secondary/30 border-border flex shrink-0 items-center gap-4 border-b p-4">
            <InputSearch
              search={params.search ?? ""}
              handleSearchChange={handleSearchChange}
            />
            <SelectGeneric
              value={params.type ?? ""}
              onValueChange={handleTypeChange}
              placeholder="Selecione o tipo"
              options={[
                { value: "all", label: "Todos os Tipos" },
                ...clientTypeOptions,
              ]}
            />
            <SelectGeneric
              value={params.status ?? ""}
              onValueChange={handleStatusChange}
              placeholder="Selecione o status"
              options={[
                { value: "all", label: "Todos os Status" },
                ...clientStatusOptions,
              ]}
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
